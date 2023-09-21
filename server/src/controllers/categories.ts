import { RequestHandler } from 'express'

import { ResCodes, CategoryType } from '../types/enums'
import { AppRes } from '../types/express/custom-response'
import { errorHandler } from '../utils/errors'
import { categoryCRUD } from '../db/data-source'

export const addCategory: RequestHandler = async (req, res: AppRes<CategoriesPayload>, next) => {
  const user = req.user!
  const name: string = req.body.name
  const categoryType: CategoryType = req.body.categoryType

  try {
    const category = await categoryCRUD.add({ user, name, categoryType }, next)
    if (!category) return errorHandler({ message: 'Failed to create new category.' }, next)

    const categories = await categoryCRUD.findMany({ where: { user: { id: user.id } }, order: { categoryType: 'DESC', name: 'ASC' } }, next)

    res.status(201).json({ message: 'Create new category.', code: ResCodes.CREATE_CATEGORY, payload: { categories: categories || [] } })
  } catch (err) {
    errorHandler({ message: 'Failed to create new category.', details: err }, next)
  }
}

export const getCategories: RequestHandler = async (req, res: AppRes<CategoriesPayload>, next) => {
  const userId = req.userId!

  try {
    const categories = await categoryCRUD.findMany({ where: { user: { id: userId } }, order: { categoryType: 'DESC', name: 'ASC' } }, next)

    res
      .status(200)
      .json({ message: 'Category list successfully provided.', code: ResCodes.GET_CATEGORIES, payload: { categories: categories || [] } })
  } catch (err) {
    console.log(err)
    errorHandler({ message: 'Failed to get categories.', details: err }, next)
  }
}

export const deleteCategory: RequestHandler = async (req, res: AppRes<CategoriesPayload>, next) => {
  const user = req.user!
  const categoryId = req.query.id ? +req.query.id : null
  if (!categoryId) {
    return errorHandler({ message: 'Failed to delete category. Invalid query param category id.', statusCode: 400 }, next)
  }

  try {
    const result = await categoryCRUD.delete(categoryId, next)
    if (!result) {
      return errorHandler({ message: 'Failed to delete category. No one category was deleted.' }, next)
    }

    const categories = await categoryCRUD.findMany({ where: { user: { id: user.id } }, order: { categoryType: 'DESC', name: 'ASC' } }, next)

    res.status(200).json({
      message: 'Category list successfully provided',
      code: ResCodes.GET_CATEGORIES,
      payload: { categories: categories || [] }
    })
  } catch (err) {
    console.log(err)
    errorHandler({ message: 'Failed to delete category.', details: err }, next)
  }
}

export const updateCategory: RequestHandler = async (req, res: AppRes<CategoriesPayload>, next) => {
  const user = req.user!
  const categoryId: number = +req.body.id
  const name: string = req.body.name
  const categoryType: CategoryType = req.body.categoryType

  try {
    const category = await categoryCRUD.findOne({ where: { id: categoryId } }, next)
    if (!category) return errorHandler({ message: 'Failed to update category. Category with this id doesnt exist.', statusCode: 400 }, next)

    const updatedCategory = await categoryCRUD.update(category, { name, categoryType }, next)
    if (!updatedCategory) return errorHandler({ message: 'Failed to update category.' }, next)

    const categories = await categoryCRUD.findMany({ where: { user: { id: user.id } }, order: { categoryType: 'DESC', name: 'ASC' } }, next)

    res.status(200).json({
      message: 'Category list successfully provided',
      code: ResCodes.UPDATE_CATEGORY,
      payload: { categories: categories || [] }
    })
  } catch (err) {
    errorHandler({ message: 'Failed to update category.', details: err }, next)
  }
}
