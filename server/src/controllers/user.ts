import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { RequestHandler } from 'express'

import { SERVER_JWT_SECRET } from '../utils/config'
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

export const login: RequestHandler = async (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  try {
    const user = await BudgetDataSource.manager.findOneBy(Users, { email })
    if (!user) {
      return errorHandler({ message: 'User not found', statusCode: 403 }, next)
    }
    const isEqual = await bcrypt.compare(password, user.password)
    if (!isEqual) {
      return errorHandler({ message: 'Wrong password', statusCode: 403 }, next)
    }

    const token = jwt.sign({ userId: user.id }, SERVER_JWT_SECRET!, { expiresIn: '1h' })
    res.status(200).json({ message: 'Login success', token, userId: user.id })
  } catch (err) {
    console.log(err)
    errorHandler({ message: 'Failed to login', details: err }, next)
  }
}
