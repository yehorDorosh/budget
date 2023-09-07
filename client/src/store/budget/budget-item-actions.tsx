import axios from 'axios'

import { StoreAction } from '../../types/store-actions'
import { budgetItemActions } from './budget-item-slice'
import { errorHandler } from '../../utils/errors'

export const addBudgetItem: StoreAction<BudgetItemPayload> = ({ token, categoryId, name, value, userDate, filters }) => {
  const query = filters ? `?month=${filters.month}` : ''
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

export const getBudgetItems: StoreAction<BudgetItemPayload> = ({ token, filters }) => {
  const query = filters ? `?month=${filters.month}` : ''
  return async (dispatch, getState) => {
    try {
      const { data, status } = await axios.get<JSONResponse<BudgetItemPayload>>(`/api/budget/get-budget-item${query}`, {
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

export const deleteBudgetItem: StoreAction<BudgetItemPayload> = ({ token, id, filters }) => {
  const query = filters ? `&month=${filters.month}` : ''
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

export const updateBudgetItem: StoreAction<BudgetItemPayload> = ({ token, id, categoryId, name, value, userDate, filters }) => {
  const query = filters ? `?month=${filters.month}` : ''
  return async (dispatch, getState) => {
    try {
      const { data, status } = await axios.put<JSONResponse<BudgetItemPayload>>(
        `/api/budget/update-budget-item${query}`,
        { id, categoryId, name, value, userDate },
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
