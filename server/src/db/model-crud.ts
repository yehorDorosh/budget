import { NextFunction } from 'express'

import { User } from '../models/user'
import { errorHandler } from '../utils/errors'
import { Category } from '../models/category'
import { BudgetItem } from '../models/budget-item'
import { Weather } from '../models/weather'
import { DataSource, FindManyOptions, FindOneOptions } from 'typeorm'

type Models = User | Category | BudgetItem | Weather

interface CRUD<T> {
  add: <K extends keyof T>(data: Record<string, T[K]>, next: NextFunction) => Promise<null | T>
  findOne: (searchParams: { where: FindOneOptions<T>['where'] }, next: NextFunction) => Promise<null | T>
  findMany(
    searchParams: { where: FindManyOptions<T>['where']; order?: FindOneOptions<T>['order'] },
    next: NextFunction
  ): Promise<null | T[]>
  update: <K extends keyof T>(entity: T, data: Record<string, T[K]>, next: NextFunction) => Promise<null | T>
  delete: (id: number, next: NextFunction) => Promise<null | boolean>
}

export class ModelCRUD<T extends Models> implements CRUD<T> {
  protected dataSource: DataSource
  private Model: new () => T

  constructor(Model: new () => T, dataSource: DataSource) {
    this.dataSource = dataSource
    this.Model = Model
  }

  private checkParams<T extends object>(data: T): boolean {
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
      entity[key as K] = data[key]
    }

    const result = await this.dataSource.manager.save(entity)
    return result
  }

  async findOne(
    searchParams: {
      where: FindOneOptions<T>['where']
    },
    next: NextFunction
  ): Promise<null | T> {
    if (!this.checkParams(searchParams)) {
      errorHandler({ message: 'CRUD: Invalid search params' }, next)
      return null
    }

    const result = await this.dataSource.manager.findOne(this.Model, searchParams)
    return result
  }

  async findMany(
    searchParams: {
      where: FindManyOptions<T>['where']
      order?: FindOneOptions<T>['order']
    },
    next: NextFunction
  ): Promise<null | T[]> {
    if (!this.checkParams(searchParams)) {
      errorHandler({ message: 'CRUD: Invalid search params' }, next)
      return null
    }

    const result = await this.dataSource.manager.find(this.Model, searchParams)
    return result
  }

  async update<K extends keyof T>(entity: T, data: Record<string, T[K]>, next: NextFunction): Promise<null | T> {
    if (!this.checkParams(data)) {
      errorHandler({ message: 'CRUD: Invalid search params' }, next)
      return null
    }

    for (const key in data) {
      if (key in this.Model) {
        entity[key as K] = data[key]
      }
    }

    const result = await this.dataSource.manager.save(entity)
    return result
  }

  async delete(id: number, next: NextFunction): Promise<null | boolean> {
    if (!id) {
      errorHandler({ message: 'CRUD: Invalid search params' }, next)
      return null
    }

    const result = await this.dataSource.manager.delete(this.Model, id)
    return !!result.affected
  }
}
