import { RequestHandler } from 'express'
import { AppRes, ResCodes } from '../types/express/custom-response'

import { errorHandler } from '../utils/errors'
import { CategoryCRUD } from '../db/crud'

export const addCategory: RequestHandler = async (req, res: AppRes<CategoriesPayload>, next) => {
  const user = req.user!
  const name: string = req.body.name

  try {
    await CategoryCRUD.add(user, name, next)

    const categories = await CategoryCRUD.get(user.id, next)

    res.status(201).json({ message: 'Create new category', code: ResCodes.CREATE_CATEGORY, payload: { categories: categories || [] } })
  } catch (err) {
    console.log(err)
    errorHandler({ message: 'Failed to create new category', details: err }, next)
  }
}

export const getCategories: RequestHandler = async (req, res: AppRes<CategoriesPayload>, next) => {
  const userId = req.userId!

  try {
    const categories = await CategoryCRUD.get(userId, next)

    res
      .status(200)
      .json({ message: 'Category list successfully provided', code: ResCodes.GET_CATEGORIES, payload: { categories: categories || [] } })
  } catch (err) {
    console.log(err)
    errorHandler({ message: 'Failed to create new user', details: err }, next)
  }
}
