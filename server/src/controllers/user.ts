import { RequestHandler } from 'express'
import { validationResult } from 'express-validator'

import { BudgetDataSource } from '../db/data-source'
import { Users } from '../models/users'

export const signup: RequestHandler = async (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'SignUp validation failed', errors: errors.array() })
  }

  const user = new Users()
  user.email = email
  user.password = password
  try {
    const dbRes = await BudgetDataSource.manager.save(user)
    res.status(201).json({ message: 'Create new user', user: dbRes })
  } catch (e) {
    next(e)
  }
}
