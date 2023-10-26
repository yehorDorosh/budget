import axios from 'axios'

import { StoreAction } from '../../types/store-actions'
import { errorHandler } from '../../utils/errors'
import objectToQueryString from '../../utils/query'
import { ReducerType } from '../../types/enum'

export const addBudgetItem: StoreAction<BudgetItemPayload> = ({ token, categoryId, name, value, userDate }) => {
  return async (dispatch, getState) => {
    try {
      const { data, status } = await axios.post<JSONResponse<BudgetItemPayload>>(
        `/api/budget/add-budget-item`,
        { categoryId, name, value, userDate },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}

export const getBudgetItems: StoreAction<BudgetItemPayload> = ({ token }, reducerType = ReducerType.budgetItemsList) => {
  return async (dispatch, getState) => {
    const filters = getState().budgetItem.filters
    const query = filters ? '?' + objectToQueryString(filters) : ''
    try {
      const { data, status } = await axios.get<JSONResponse<BudgetItemPayload>>(`/api/budget/get-budget-item${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}

export const getStatistics: StoreAction<StatisticsPayload> = ({ token }) => {
  return async (dispatch, getState) => {
    const filters = getState().budgetItem.filters
    const query = filters ? '?' + objectToQueryString(filters, ['page', 'perPage', 'ignore', 'categoryType', 'category']) : ''
    try {
      const { data, status } = await axios.get<JSONResponse<StatisticsPayload>>(`/api/budget/get-statistics${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}

export const getMonthlyTrend: StoreAction<MonthlyTrendPayload> = ({ token, year }) => {
  return async (dispatch, getState) => {
    const query = year ? '?' + objectToQueryString({ year }) : ''
    try {
      const { data, status } = await axios.get<JSONResponse<MonthlyTrendPayload>>(`/api/budget/get-monthly-trend${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}

export const deleteBudgetItem: StoreAction<BudgetItemPayload> = ({ token, id }) => {
  return async (dispatch, getState) => {
    try {
      const { data, status } = await axios.delete<JSONResponse<BudgetItemPayload>>(`/api/budget/delete-budget-item?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}

export const updateBudgetItem: StoreAction<BudgetItemPayload> = ({ token, id, categoryId, name, value, userDate, ignore }) => {
  return async (dispatch, getState) => {
    try {
      const { data, status } = await axios.put<JSONResponse<BudgetItemPayload>>(
        `/api/budget/update-budget-item`,
        { id, categoryId, name, value, userDate, ignore },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}

export const searchNames: StoreAction<string[]> = ({ token, name }) => {
  return async (dispatch, getState) => {
    try {
      const { data, status } = await axios.get<JSONResponse<string[]>>(`/api/budget/search-names?name=${name}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}
