import { ModelCRUD } from './model-crud'
import { Weather } from '../models/weather'
import { NextFunction } from 'express'
import { errorHandler } from '../utils/errors'

export class WeatherCRUD extends ModelCRUD<Weather> {
  async getLast(next: NextFunction) {
    const weathers = await this.dataSource
      .getRepository(Weather)
      .createQueryBuilder('weather')
      .where('id = :id1 AND reg_date IN (SELECT MAX(reg_date) FROM weather WHERE id = :id1)', { id1: '1' })
      .orWhere('id = :id2 AND reg_date IN (SELECT MAX(reg_date) FROM weather WHERE id = :id2)', { id2: '2nd-floor' })
      .orWhere('id = :id3 AND reg_date IN (SELECT MAX(reg_date) FROM weather WHERE id = :id3)', { id3: 'out-of-door' })
      .getMany()

    if (!weathers) {
      errorHandler({ message: 'No weather data', statusCode: 403 }, next)
      return null
    }
    return weathers
  }
}
