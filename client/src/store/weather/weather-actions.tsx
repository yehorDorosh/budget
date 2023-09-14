import axios from 'axios'

import { StoreAction } from '../../types/store-actions'
import { errorHandler } from '../../utils/errors'
import { weatherActions } from './weather-slice'
import objectToQueryString from '../../utils/query'

export const getWeather: StoreAction<WeatherPayload> = ({ id, dbId, dateFrom, dateTo }) => {
  const searchParams: Partial<{ id: number; dbId: number; dateFrom: string; dateTo: string }> = {}
  if (id) searchParams.id = id
  if (dbId) searchParams.dbId = dbId
  if (dateFrom) searchParams.dateFrom = dateFrom
  if (dateTo) searchParams.dateTo = dateTo
  const query = '?' + objectToQueryString(searchParams)

  return async (dispatch, getState) => {
    try {
      const { data, status } = await axios.get<JSONResponse<WeatherPayload>>(`/api/weather${query}`)
      if (data.payload && data.payload.weather) {
        dispatch(weatherActions.setWeather(data.payload.weather))
      }
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}

export const getLastWeather: StoreAction<WeatherPayload> = () => {
  return async (dispatch, getState) => {
    try {
      const { data, status } = await axios.get<JSONResponse<WeatherPayload>>('/api/weather/last')
      if (data.payload && data.payload.weather) {
        dispatch(weatherActions.setWeather(data.payload.weather))
      }
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}
