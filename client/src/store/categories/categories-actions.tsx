import axios from 'axios'

import { StoreAction } from '../../types/actions/actions'
import { categoriesActions } from './categories-slice'
import { errorHandler } from '../../utils/errors'

export const addCategory: StoreAction<CategoriesPayload> = (token: string, name: string) => {
  return async (dispatch, getState) => {
    try {
      const { data, status } = await axios.post<JSONResponse<CategoriesPayload>>(
        '/api/categories/add',
        { name },
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

export const deleteCategory: StoreAction<CategoriesPayload> = (token: string, id: number) => {
  return async (dispatch, getState) => {
    try {
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

export const updateCategory: StoreAction<CategoriesPayload> = (token: string, id: number, name: string) => {
  return async (dispatch, getState) => {
    try {
      const { data, status } = await axios.put<JSONResponse<CategoriesPayload>>(
        '/api/categories/update',
        { id, name },
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
