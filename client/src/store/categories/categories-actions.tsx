import axios from 'axios'

import { StoreAction, EmailOrPassword } from '../../types/actions/actions'
import { categoriesActions } from './categories-slice'
import { errorHandler } from '../../utils/errors'

export const addCategory: StoreAction<CategoriesPayload> = (token: string, name?: string | EmailOrPassword | number, logType?: string) => {
  return async (dispatch, getState) => {
    try {
      if (typeof name !== 'string' || !logType) throw new Error('categories-cations.tsx: addCategory invalid params')
      const { data, status } = await axios.post<JSONResponse<CategoriesPayload>>(
        '/api/categories/add',
        { name, logType },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.payload && data.payload.categories) {
        dispatch(categoriesActions.setCategories(data.payload.categories))
      }
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}

export const getCategories: StoreAction<CategoriesPayload> = (token: string) => {
  return async (dispatch, getState) => {
    try {
      const { data, status } = await axios.get<JSONResponse<CategoriesPayload>>('/api/categories/get', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.payload && data.payload.categories) {
        dispatch(categoriesActions.setCategories(data.payload.categories))
      }
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}

export const deleteCategory: StoreAction<CategoriesPayload> = (token: string, id?: number | EmailOrPassword | string) => {
  return async (dispatch, getState) => {
    try {
      if (typeof id !== 'number') throw new Error('Category id is not a number')
      const { data, status } = await axios.delete<JSONResponse<CategoriesPayload>>(`/api/categories/delete?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.payload && data.payload.categories) {
        dispatch(categoriesActions.setCategories(data.payload.categories))
      }
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}

export const updateCategory: StoreAction<CategoriesPayload> = (
  token: string,
  id?: number | EmailOrPassword | string,
  name?: string,
  logType?: string
) => {
  return async (dispatch, getState) => {
    try {
      if (typeof id !== 'number') throw new Error('Category id is not a number')
      if (typeof name !== 'string') throw new Error('Category name is not a string')
      if (typeof logType !== 'string') throw new Error('Category type is not a string')
      const { data, status } = await axios.put<JSONResponse<CategoriesPayload>>(
        '/api/categories/update',
        { id, name, logType },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.payload && data.payload.categories) {
        dispatch(categoriesActions.setCategories(data.payload.categories))
      }
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}
