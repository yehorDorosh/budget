import bcrypt from 'bcryptjs'

import { RequestHandler } from 'express'

import { errorHandler } from '../utils/errors'
import { BudgetDataSource } from '../db/data-source'
import { Users } from '../models/users'

export const signup: RequestHandler = async (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const user = new Users()
  user.email = email

  try {
    user.password = await bcrypt.hash(password, 12)
    await BudgetDataSource.manager.save(user)
    res.status(201).json({ message: 'Create new user' })
  } catch (err) {
    errorHandler({ message: 'Failed to create new user', details: err }, next)
  }
}
