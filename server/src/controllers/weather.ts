import { RequestHandler } from 'express'
import { WeatherCRUD } from '../db/crud'
import { errorHandler } from '../utils/errors'

export const saveWeaterData: RequestHandler = async (req, res, next) => {
  const id: string = req.body.id
  const t: number = req.body.t
  const p: number = req.body.p
  const v: number = req.body.v

  try {
    const weather = await WeatherCRUD.add(id, t, p, v, next)
    if (!weather) return errorHandler({ message: 'addBudgetItem failed. BudgetItemCRUD.add failed', statusCode: 404 }, next)

    res.status(201).json({ message: 'Create new weather data', payload: { weather } })
  } catch (err) {
    errorHandler({ message: 'Failed to create budget item', details: err }, next)
  }
}

export const getWeatherData: RequestHandler = async (req, res, next) => {
  try {
    const weather = await WeatherCRUD.get(next)
    if (!weather) return errorHandler({ message: 'getBudgetItems failed. BudgetItemCRUD.get failed', statusCode: 404 }, next)

    res.status(200).json({ message: 'Get budget items', payload: { weather } })
  } catch (err) {
    errorHandler({ message: 'Failed to get budget items', details: err }, next)
  }
}
