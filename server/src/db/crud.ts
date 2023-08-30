import { NextFunction } from 'express'

import { BudgetDataSource } from './data-source'
import { User } from '../models/user'
import { errorHandler } from '../utils/errors'
import { Category } from '../models/category'

type GetUser = (selector: { userId?: UserId; email?: string }, next: NextFunction) => Promise<User | null>
type GetCategories = (userId: UserId, next: NextFunction) => Promise<Category[] | null>

export const getUser: GetUser = async ({ userId, email }, next: NextFunction) => {
  console.log('getUser(CRUD)', { userId, email })
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

export const getCategories: GetCategories = async (userId, next) => {
  console.log('getCategories(CRUD)', { userId })
  if (!userId) {
    errorHandler({ message: 'Invalid search params for getCategories(CRUD)', statusCode: 500 }, next)
    return null
  }
  const categories = await BudgetDataSource.manager.findBy(Category, { user: { id: userId } })
  if (!categories) {
    errorHandler({ message: 'No categories for this user', statusCode: 403 }, next)
    return null
  }
  return categories
}
