import axios from 'axios'

import { StoreAction } from '../../types/store-actions'
import { budgetItemActions } from './budget-item-slice'
import { errorHandler } from '../../utils/errors'
import objectToQueryString from '../../utils/query'
import { ReducerType } from '../../types/enum'

export const addBudgetItem: StoreAction<BudgetItemPayload> = ({ token, categoryId, name, value, userDate, filters }) => {
  const query = filters ? '?' + objectToQueryString(filters) : ''
  return async (dispatch, getState) => {
    try {
      const { data, status } = await axios.post<JSONResponse<BudgetItemPayload>>(
        `/api/budget/add-budget-item${query}`,
        { categoryId, name, value, userDate },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.payload && data.payload.budgetItems) {
        dispatch(budgetItemActions.setBudgetItems(data.payload.budgetItems))
      }
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}

export const getBudgetItems: StoreAction<BudgetItemPayload> = ({ token, filters }, reducerType = ReducerType.budgetItemsList) => {
  const query = filters ? '?' + objectToQueryString(filters) : ''
  return async (dispatch, getState) => {
    try {
      const { data, status } = await axios.get<JSONResponse<BudgetItemPayload>>(`/api/budget/get-budget-item${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.payload && data.payload.budgetItems) {
        if (reducerType === ReducerType.budgetItemsList) dispatch(budgetItemActions.setBudgetItems(data.payload.budgetItems))
        if (reducerType === ReducerType.BudgetItemsTrend) dispatch(budgetItemActions.setTrendBudgetItems(data.payload.budgetItems))
      }
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}

export const deleteBudgetItem: StoreAction<BudgetItemPayload> = ({ token, id, filters }) => {
  const query = filters ? '&' + objectToQueryString(filters) : ''
  return async (dispatch, getState) => {
    try {
      const { data, status } = await axios.delete<JSONResponse<BudgetItemPayload>>(`/api/budget/delete-budget-item?id=${id}${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.payload && data.payload.budgetItems) {
        dispatch(budgetItemActions.setBudgetItems(data.payload.budgetItems))
      }
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}

export const updateBudgetItem: StoreAction<BudgetItemPayload> = ({ token, id, categoryId, name, value, userDate, filters, ignore }) => {
  const query = filters ? '?' + objectToQueryString(filters) : ''
  return async (dispatch, getState) => {
    try {
      const { data, status } = await axios.put<JSONResponse<BudgetItemPayload>>(
        `/api/budget/update-budget-item${query}`,
        { id, categoryId, name, value, userDate, ignore },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.payload && data.payload.budgetItems) {
        dispatch(budgetItemActions.setBudgetItems(data.payload.budgetItems))
      }
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}
