import { RequestHandler } from 'express'
import { AppRes, ResCodes } from '../types/express/custom-response'

import { errorHandler } from '../utils/errors'
import { CategoryCRUD } from '../db/crud'
import { QueryFailedError } from 'typeorm'

export const addCategory: RequestHandler = async (req, res: AppRes<CategoriesPayload>, next) => {
  const user = req.user!
  const name: string = req.body.name

  try {
    await CategoryCRUD.add(user, name, next)

    const categories = await CategoryCRUD.get(user.id, next)

    res.status(201).json({ message: 'Create new category', code: ResCodes.CREATE_CATEGORY, payload: { categories: categories || [] } })
  } catch (err) {
    if (err instanceof QueryFailedError && err.driverError.code == 23505) {
      res.status(422).json({
        message: 'Category already exist',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [
          {
            location: 'body',
            msg: 'Category already exist',
            path: 'name',
            type: 'field',
            value: name
          }
        ]
      })
    } else {
      errorHandler({ message: 'Failed to create new category', details: err }, next)
    }
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
    await CategoryCRUD.delete(categoryId, next)

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
  const categoryId: number = +req.body.categoryId
  const name: string = req.body.name

  try {
    await CategoryCRUD.update(categoryId, name, next)

    const categories = await CategoryCRUD.get(user.id, next)

    res.status(200).json({
      message: 'Category list successfully provided',
      code: ResCodes.UPDATE_CATEGORY,
      payload: { categories: categories || [] }
    })
  } catch (err) {
    console.log(err)
    errorHandler({ message: 'Failed to create new user', details: err }, next)
  }
}
