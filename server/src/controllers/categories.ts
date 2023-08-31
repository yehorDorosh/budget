import { RequestHandler } from 'express'
import { AppRes, ResCodes } from '../types/express/custom-response'

import { errorHandler } from '../utils/errors'
import { BudgetDataSource } from '../db/data-source'
import { Category } from '../models/category'
import { getCategories } from '../db/crud'

export const addCategory: RequestHandler = async (req, res: AppRes<CategoriesPayload>, next) => {
  const user = req.user!
  const name = req.body.name
  const category = new Category()
  category.name = name

  category.user = user
  try {
    await BudgetDataSource.manager.save(category)
    const categories = await getCategories(user.id, next)
    res.status(201).json({ message: 'Create new user', code: ResCodes.CREATE_USER, payload: { categories: categories || [] } })
  } catch (err) {
    console.log(err)
    errorHandler({ message: 'Failed to create new user', details: err }, next)
  }
}
