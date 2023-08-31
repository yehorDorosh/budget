import { NextFunction } from 'express'

import { BudgetDataSource } from './data-source'
import { User } from '../models/user'
import { errorHandler } from '../utils/errors'
import { Category } from '../models/category'

export class UserCRUD {
  static add = async (email: string, password: string, next: NextFunction) => {
    if (!email || !password) {
      errorHandler({ message: 'Invalid search params for addUser(CRUD)', statusCode: 500 }, next)
      return null
    }
    const user = new User()
    user.email = email
    user.password = password
    await BudgetDataSource.manager.save(user)
    return user
  }

  static get = async ({ userId, email }: { userId?: UserId; email?: string }, next: NextFunction) => {
    if (!userId && !email) {
      errorHandler({ message: 'Invalid search params for getUser(CRUD)', statusCode: 500 }, next)
      return null
    }
    const searchParams = userId ? { id: userId } : email ? { email } : {}
    const user = await BudgetDataSource.manager.findOneBy(User, searchParams)
    if (!user) {
      errorHandler({ message: 'User not found', statusCode: 403 }, next)
      return null
    }
    return user
  }

  static delete = async (user: User, next: NextFunction) => {
    if (!user) {
      errorHandler({ message: 'Invalid search params for deleteUser(CRUD)', statusCode: 500 }, next)
      return null
    }
    await BudgetDataSource.manager.remove(user)
    return user
  }

  static update = async (
    user: User,
    { email, password }: { email: string; password?: string } | { email?: string; password: string },
    next: NextFunction
  ) => {
    if (!user || (!email && !password)) {
      errorHandler({ message: 'Invalid search params for updateUser(CRUD)', statusCode: 500 }, next)
      return null
    }
    if (email) user.email = email
    if (password) user.password = password
    await BudgetDataSource.manager.save(user)
    return user
  }
}

export class CategoryCRUD {
  static add = async (user: User, name: string, next: NextFunction) => {
    if (!user || !name) {
      errorHandler({ message: 'Invalid search params for addCategory(CRUD)', statusCode: 500 }, next)
      return null
    }
    const category = new Category()
    category.name = name
    category.user = user
    await BudgetDataSource.manager.save(category)
    return category
  }

  static get = async (userId: UserId, next: NextFunction) => {
    if (!userId) {
      errorHandler({ message: 'Invalid search params for getCategories(CRUD)', statusCode: 500 }, next)
      return null
    }
    const categories = await BudgetDataSource.getRepository(Category).find({ where: { user: { id: userId } }, order: { name: 'ASC' } })
    if (!categories) {
      errorHandler({ message: 'No categories for this user', statusCode: 403 }, next)
      return null
    }
    return categories
  }

  static delete = async (categoryId: number, next: NextFunction) => {
    if (!categoryId) {
      errorHandler({ message: 'Invalid search params for deleteCategory(CRUD)', statusCode: 500 }, next)
      return null
    }
    const category = await BudgetDataSource.manager.findOneBy(Category, { id: categoryId })
    if (!category) {
      errorHandler({ message: 'Category not found', statusCode: 403 }, next)
      return null
    }
    await BudgetDataSource.manager.remove(category)
    return category
  }

  static update = async (categoryId: number, name: string, next: NextFunction) => {
    if (!categoryId || !name) {
      errorHandler({ message: 'Invalid search params for updateCategory(CRUD)', statusCode: 500 }, next)
      return null
    }

    const category = await BudgetDataSource.manager.findOneBy(Category, { id: categoryId })
    if (!category) {
      errorHandler({ message: 'Category not found', statusCode: 403 }, next)
      return null
    }
    category.name = name
    await BudgetDataSource.manager.save(category)
    return category
  }
}
