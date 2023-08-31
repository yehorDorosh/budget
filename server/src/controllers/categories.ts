import { RequestHandler } from 'express'
import { AppRes, ResCodes } from '../types/express/custom-response'

import { errorHandler } from '../utils/errors'
import { CategoryCRUD } from '../db/crud'

export const addCategory: RequestHandler = async (req, res: AppRes<CategoriesPayload>, next) => {
  const user = req.user!
  const name: string = req.body.name

  try {
    const category = await CategoryCRUD.add(user, name, next)
    if (!category) return errorHandler({ message: 'addCategory failed. CategoryCRUD.add failed', statusCode: 403 }, next)

    const categories = await CategoryCRUD.get(user.id, next)

    res.status(201).json({ message: 'Create new category', code: ResCodes.CREATE_CATEGORY, payload: { categories: categories || [] } })
  } catch (err) {
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

export const deleteCategory: RequestHandler = async (req, res: AppRes<CategoriesPayload>, next) => {
  const user = req.user!
  const categoryId = req.query.id ? +req.query.id : null
  if (!categoryId) {
    return errorHandler({ message: 'deleteCategory. Invalid query param id', statusCode: 500 }, next)
  }

  try {
    const category = await CategoryCRUD.delete(categoryId, next)
    if (!category) return errorHandler({ message: 'deleteCategory failed. CategoryCRUD.delete failed', statusCode: 403 }, next)

    const categories = await CategoryCRUD.get(user.id, next)

    res.status(200).json({
      message: 'Category list successfully provided',
      code: ResCodes.GET_CATEGORIES,
      payload: { categories: categories || [] }
    })
  } catch (err) {
    console.log(err)
    errorHandler({ message: 'Failed to create new user', details: err }, next)
  }
}

export const updateCategory: RequestHandler = async (req, res: AppRes<CategoriesPayload>, next) => {
  const user = req.user!
  const categoryId: number = +req.body.id
  const name: string = req.body.name

  try {
    const category = await CategoryCRUD.update(categoryId, name, next)
    if (!category) return errorHandler({ message: 'updateCategory failed. CategoryCRUD.update failed', statusCode: 403 }, next)

    const categories = await CategoryCRUD.get(user.id, next)

    res.status(200).json({
      message: 'Category list successfully provided',
      code: ResCodes.UPDATE_CATEGORY,
      payload: { categories: categories || [] }
    })
  } catch (err) {
    errorHandler({ message: 'Failed to create new user', details: err }, next)
  }
}
