import { NextFunction } from 'express'

import { BudgetDataSource } from './data-source'
import { User } from '../models/user'
import { errorHandler } from '../utils/errors'

type GetUser = (selector: { userId?: UserId; email?: string }, next: NextFunction) => Promise<User | null>

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
