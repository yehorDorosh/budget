import { Request } from 'express'

import { RequestHandler } from 'express'
import { CategoryType, ResCodes } from '../types/enums'
import { AppRes } from '../types/express/custom-response'
import { errorHandler } from '../utils/errors'
import { budgetItemCRUD } from '../db/data-source'
import { categoryCRUD } from '../db/data-source'

const parseFilterQuery = (req: Request): BudgetItemsFilters => {
  const month = req.query.month ? req.query.month.toString() : undefined
  const year = req.query.year ? req.query.year.toString() : undefined
  const active = req.query.active ? +req.query.active : undefined
  const name = req.query.name ? req.query.name.toString() : undefined
  const categoryType = req.query.categoryType ? (req.query.categoryType as CategoryType) : undefined
  const category = req.query.category ? +req.query.category : undefined
  const ignore = req.query.ignore === 'true' ? true : req.query.ignore === 'false' ? false : undefined
  const page = req.query.page ? +req.query.page : undefined
  const perPage = req.query.perPage ? +req.query.perPage : undefined
  return { month, year, active, name, categoryType, category, ignore, page, perPage }
}

export const addBudgetItem: RequestHandler = async (req, res: AppRes, next) => {
  const user = req.user!
  const categoryId: number = req.body.categoryId
  const name: string = req.body.name
  const value: number = req.body.value
  const userDate: Date = new Date(req.body.userDate)

  try {
    const category = await categoryCRUD.findOne({ where: { id: categoryId } }, next)
    if (!category) return errorHandler({ message: 'Failed to create budget item. No category for this budget item.' }, next)

    const budgetItem = await budgetItemCRUD.add({ user, category, name, value, userDate }, next)
    if (!budgetItem) return errorHandler({ message: 'Failed to create budget item.' }, next)

    res.status(201).json({ message: 'Create new budget item.', code: ResCodes.CREATE_BUDGET_ITEM })
  } catch (err) {
    errorHandler({ message: 'Failed to create budget item.', details: err }, next)
  }
}

export const getBudgetItems: RequestHandler = async (req, res: AppRes<BudgetItemsPayload>, next) => {
  const user = req.user!

  try {
    const budgetItems = await budgetItemCRUD.findManyWithFilters(user.id, parseFilterQuery(req), next)

    res.status(200).json({
      message: 'Budget items provided successfully.',
      code: ResCodes.GET_BUDGET_ITEMS,
      payload: { budgetItems: budgetItems || [] }
    })
  } catch (err) {
    errorHandler({ message: 'Failed to get budget items', details: err }, next)
  }
}

export const deleteBudgetItem: RequestHandler = async (req, res: AppRes, next) => {
  const budgetItemId: number = +req.query.id!

  try {
    const result = await budgetItemCRUD.delete(budgetItemId, next)
    if (!result) return errorHandler({ message: 'Failed to delete budget item. No one items was deleted.' }, next)

    res.status(200).json({
      message: 'Budget item deleted successfully.',
      code: ResCodes.DELETE_BUDGET_ITEM
    })
  } catch (err) {
    errorHandler({ message: 'Failed to delete budget item.', details: err }, next)
  }
}

export const updateBudgetItem: RequestHandler = async (req, res: AppRes, next) => {
  const budgetItemId: number = +req.body.id
  const categoryId: number = +req.body.categoryId
  const name: string = req.body.name
  const value: number = +req.body.value
  const userDate: Date = new Date(req.body.userDate)
  const ignore: boolean = req.body.ignore === 'true'

  try {
    const budgetItem = await budgetItemCRUD.findOne({ where: { id: budgetItemId } }, next)
    if (!budgetItem) return errorHandler({ message: 'Failed to update budget item. Item does not exist.' }, next)

    const category = await categoryCRUD.findOne({ where: { id: categoryId } }, next)
    if (!category) return errorHandler({ message: 'Failed to update budget item. Category for this budget item does not exist.' }, next)

    const updatedBudgetItem = await budgetItemCRUD.update(budgetItem, { name, value, userDate, category, ignore }, next)
    if (!updatedBudgetItem) return errorHandler({ message: 'Failed to update budget item.' }, next)

    res.status(200).json({
      message: 'Budget item was updated successfully.',
      code: ResCodes.UPDATE_BUDGET_ITEM
    })
  } catch (err) {
    errorHandler({ message: 'Failed to update budget item.', details: err }, next)
  }
}

export const getStatistics: RequestHandler = async (req, res: AppRes<StatisticsPayload>, next) => {
  const user = req.user!

  try {
    const result = await budgetItemCRUD.getStatistics(user.id, parseFilterQuery(req), next)
    const categoriesRates = await budgetItemCRUD.getCategoriesRates(user.id, parseFilterQuery(req), next)

    if (!result || !categoriesRates) return errorHandler({ message: 'Failed to get statistics', details: 'Invalid user id.' }, next)

    res.status(200).json({
      message: 'Statistics provided successfully.',
      code: ResCodes.GET_STATISTICS,
      payload: { sum: result.sum, expenses: result.expenses, incomes: result.incomes, categoriesRates }
    })
  } catch (err) {
    errorHandler({ message: 'Failed to get statistics.', details: err }, next)
  }
}

export const getMonthlyTrend: RequestHandler = async (req, res: AppRes<MonthlyTrendPayload>, next) => {
  const user = req.user!

  try {
    const result = await budgetItemCRUD.getTrendData(user.id, parseFilterQuery(req), next)
    if (!result) return errorHandler({ message: 'Failed to get monthly trend', details: 'Invalid user id.' }, next)

    res.status(200).json({
      message: 'Monthly trend provided successfully.',
      code: ResCodes.GET_MONTHLY_TREND,
      payload: {
        aveExpenses: result.averageExpenses,
        aveIncomes: result.averageIncomes,
        aveSaved: result.averageSaved,
        totalSaved: result.totalSaved,
        monthlyExpenses: result.monthlyExpenses,
        monthlyIncomes: result.monthlyIncomes,
        maxTotal: result.maxTotal
      }
    })
  } catch (err) {
    errorHandler({ message: 'Failed to get monthly trend.', details: err }, next)
  }
}
