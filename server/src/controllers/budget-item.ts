import { Request } from 'express'

import { RequestHandler } from 'express'
import { CategoryType, ResCodes } from '../types/enums'
import { AppRes } from '../types/express/custom-response'
import { errorHandler } from '../utils/errors'
import { CategoryCRUD, budgetItemCRUD } from '../db/crud'

const parseFilterQuery = (req: Request): BudgetItemsFilters => {
  console.log(req.query.categoryType)
  const month = req.query.month ? req.query.month.toString() : undefined
  const year = req.query.year ? req.query.year.toString() : undefined
  const active = req.query.active ? +req.query.active : undefined
  const name = req.query.name ? req.query.name.toString() : undefined
  const categoryType = req.query.categoryType ? (req.query.categoryType as CategoryType) : undefined
  const category = req.query.category ? +req.query.category : undefined
  const ignore = req.query.ignore === 'true' ? true : req.query.ignore === 'false' ? false : undefined
  return { month, year, active, name, categoryType, category, ignore }
}

export const addBudgetItem: RequestHandler = async (req, res: AppRes<BudgetItemsPayload>, next) => {
  const user = req.user!
  const categoryId: number = req.body.categoryId
  const name: string = req.body.name
  const value: number = req.body.value
  const userDate: Date = new Date(req.body.userDate)

  try {
    const category = await CategoryCRUD.getById(categoryId, next)
    if (!category) return errorHandler({ message: 'addBudgetItem failed. CategoryCRUD.getById failed', statusCode: 404 }, next)

    const budgetItem = await budgetItemCRUD.add(user, category, name, value, userDate, next)
    if (!budgetItem) return errorHandler({ message: 'addBudgetItem failed. BudgetItemCRUD.add failed', statusCode: 404 }, next)

    const budgetItems = await budgetItemCRUD.get(user.id, next, parseFilterQuery(req))

    res
      .status(201)
      .json({ message: 'Create new budget item', code: ResCodes.CREATE_BUDGET_ITEM, payload: { budgetItems: budgetItems || [] } })
  } catch (err) {
    errorHandler({ message: 'Failed to create budget item', details: err }, next)
  }
}

export const getBudgetItems: RequestHandler = async (req, res: AppRes<BudgetItemsPayload>, next) => {
  const user = req.user!

  try {
    const budgetItems = await budgetItemCRUD.get(user.id, next, parseFilterQuery(req))
    if (!budgetItems) return errorHandler({ message: 'getBudgetItems failed. BudgetItemCRUD.get failed', statusCode: 404 }, next)

    res.status(200).json({ message: 'Get budget items', code: ResCodes.GET_BUDGET_ITEMS, payload: { budgetItems } })
  } catch (err) {
    errorHandler({ message: 'Failed to get budget items', details: err }, next)
  }
}

export const deleteBudgetItem: RequestHandler = async (req, res: AppRes<BudgetItemsPayload>, next) => {
  const user = req.user!
  const budgetItemId: number | null = req.query.id ? +req.query.id : null
  if (!budgetItemId) return errorHandler({ message: 'deleteBudgetItem failed. BudgetItemId is null', statusCode: 404 }, next)

  try {
    const budgetItem = await budgetItemCRUD.delete(budgetItemId, next)
    if (!budgetItem) return errorHandler({ message: 'deleteBudgetItem failed. BudgetItemCRUD.delete failed', statusCode: 404 }, next)

    const budgetItems = await budgetItemCRUD.get(user.id, next, parseFilterQuery(req))
    if (!budgetItems) return errorHandler({ message: 'deleteBudgetItem failed. BudgetItemCRUD.get failed', statusCode: 404 }, next)

    res.status(200).json({ message: 'Delete budget item', code: ResCodes.DELETE_BUDGET_ITEM, payload: { budgetItems } })
  } catch (err) {
    errorHandler({ message: 'Failed to delete budget item', details: err }, next)
  }
}

export const updateBudgetItem: RequestHandler = async (req, res: AppRes<BudgetItemsPayload>, next) => {
  const user = req.user!
  const budgetItemId: number = req.body.id
  const categoryId: number = req.body.categoryId
  const name: string = req.body.name
  const value: number = req.body.value
  const userDate: Date = new Date(req.body.userDate)
  const ignore: boolean = req.body.ignore

  try {
    const budgetItem = await budgetItemCRUD.update(budgetItemId, { name, value, userDate, categoryId, ignore }, next)
    if (!budgetItem) return errorHandler({ message: 'updateBudgetItem failed. BudgetItemCRUD.update failed', statusCode: 404 }, next)

    const budgetItems = await budgetItemCRUD.get(user.id, next, parseFilterQuery(req))
    if (!budgetItems) return errorHandler({ message: 'updateBudgetItem failed. BudgetItemCRUD.get failed', statusCode: 404 }, next)

    res.status(200).json({ message: 'Update budget item', code: ResCodes.UPDATE_BUDGET_ITEM, payload: { budgetItems } })
  } catch (err) {
    errorHandler({ message: 'Failed to update budget item', details: err }, next)
  }
}
