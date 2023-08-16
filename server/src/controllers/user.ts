import { RequestHandler } from 'express'

import { BudgetDataSource } from '../db/data-source'
import { Users } from '../models/users'

export const signup: RequestHandler = async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  const user = new Users()
  user.email = email
  user.password = password
  try {
    const dbRes = await BudgetDataSource.manager.save(user)
    res.status(201).json({ message: 'Create new user', user: dbRes })
  } catch (e) {
    console.log(e)
  }
}
