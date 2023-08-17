import { RequestHandler } from 'express'
import { validationResult } from 'express-validator'

import { ProjectError } from '../utils/errors'
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
    await BudgetDataSource.manager.save(user)
    res.status(201).json({ message: 'Create new user' })
  } catch (err) {
    const error = new ProjectError('Create new user failed')
    error.details = err
    next(error)
  }
}
