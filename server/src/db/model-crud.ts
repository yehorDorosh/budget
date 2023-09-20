import { NextFunction } from 'express'

import { User } from '../models/user'
import { errorHandler } from '../utils/errors'
import { Category } from '../models/category'
import { BudgetItem } from '../models/budget-item'
import { Weather } from '../models/weather'
import { DataSource } from 'typeorm'

type Models = User | Category | BudgetItem | Weather
type SearchParams = { [key: string]: string | number | object }

interface EntityManagerMethods<T> {
  find(model: T, options?: Record<string, string | number>): Promise<null | T[] | T>
  findOne(model: T, options?: Record<string, string | number>): Promise<null | T[] | T>
}

interface CRUD<T> {
  add: <K extends keyof T>(data: Record<string, T[K]>, next: NextFunction) => Promise<null | T>
  get: (searchParams: SearchParams, method: keyof EntityManagerMethods<T>, next: NextFunction) => Promise<null | T | T[]>
}

export class ModelCRUD<T extends Models> implements CRUD<T> {
  private dataSource: DataSource
  private Model: new () => T

  constructor(Model: new () => T, dataSource: DataSource) {
    this.dataSource = dataSource
    this.Model = Model
  }

  protected checkParams<T extends object>(data: T): boolean {
    if (Object.keys(data).length === 0) {
      return false
    }
    for (const key in data) {
      if (data[key] === undefined) {
        return false
      }
    }
    return true
  }

  async add<K extends keyof T>(data: Record<string, T[K]>, next: NextFunction): Promise<null | T> {
    if (!this.checkParams(data)) {
      errorHandler({ message: 'CRUD: Invalid search params' }, next)
      return null
    }

    const entity = new this.Model()

    for (const key in data) {
      if (key in this.Model) {
        entity[key as K] = data[key]
      }
    }

    try {
      const result = await this.dataSource.manager.save(entity)
      return result
    } catch (error) {
      errorHandler({ message: 'CRUD: add operation failed' }, next)
      return null
    }
  }

  async get(searchParams: SearchParams, method: keyof EntityManagerMethods<T>, next: NextFunction): Promise<null | T[] | T> {
    if (searchParams === undefined || (typeof searchParams === 'object' && !this.checkParams(searchParams))) {
      errorHandler({ message: 'CRUD: Invalid search params' }, next)
      return null
    }

    try {
      if (method in this.dataSource.manager && typeof this.dataSource.manager[method] === 'function') {
        const result = await this.dataSource.manager[method](this.Model, searchParams)
        return Array.isArray(result) ? result : result ? result : null
      } else {
        errorHandler({ message: 'CRUD: Invalid method' }, next)
        return null
      }
    } catch (error) {
      errorHandler({ message: 'CRUD: get operation failed' }, next)
      return null
    }
  }
}
