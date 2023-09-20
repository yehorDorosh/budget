import { RequestHandler } from 'express'
import { weatherCRUD } from '../models/weather'
import { errorHandler } from '../utils/errors'
import { Between, FindOperator } from 'typeorm'
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions'
import { Weather } from '../models/weather'

export const saveWeaterData: RequestHandler = async (req, res, next) => {
  const id: string = req.body.id
  const t: number = req.body.t
  const p: number = req.body.p
  const v: number = req.body.v

  try {
    const weather = await weatherCRUD.add({ id, t, p, v }, next)
    if (!weather) return errorHandler({ message: 'addWeather failed. WeatherCRUD.add failed', statusCode: 404 }, next)

    res.status(201).json({ message: 'Create new weather data', payload: { weather } })
  } catch (err) {
    errorHandler({ message: 'Failed to create budget item', details: err }, next)
  }
}

export const getWeatherData: RequestHandler = async (req, res, next) => {
  const id: string | null = req.query.id ? String(req.query.id) : null
  const dbId: string | null = req.query.dbId ? String(req.query.dbId) : null
  const dateFrom: string | null = req.query.dateFrom ? String(req.query.dateFrom) : null
  const dateTo: string | null = req.query.dateTo ? String(req.query.dateTo) : null
  interface Options extends FindManyOptions<Weather> {
    where: FindManyOptions<Weather>['where'] & {
      id?: string
      dbId?: string
      regDate?: FindOperator<string>
    }
  }
  const options: Options = { where: {} }
  if (id) options.where.id = id
  if (dbId) options.where.dbId = dbId
  if (dateFrom && dateTo) {
    options.where.regDate = Between(dateFrom, dateTo)
  }

  try {
    const weather = await weatherCRUD.findMany(options, next)
    if (!weather) return errorHandler({ message: 'getWeather failed. WeatherCRUD.get failed', statusCode: 404 }, next)

    res.status(200).json({ message: 'Get weather', payload: { weather } })
  } catch (err) {
    errorHandler({ message: 'Failed to get weather', details: err }, next)
  }
}

export const getLastWeatherData: RequestHandler = async (req, res, next) => {
  try {
    const weather = await weatherCRUD.getLast(next)
    if (!weather) return errorHandler({ message: 'getWeather failed. WeatherCRUD.getLat failed', statusCode: 404 }, next)

    res.status(200).json({ message: 'Get last weather', payload: { weather } })
  } catch (err) {
    errorHandler({ message: 'Failed to get last weather', details: err }, next)
  }
}
