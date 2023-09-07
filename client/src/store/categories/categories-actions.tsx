import axios from 'axios'

import { StoreAction } from '../../types/store-actions'
import { categoriesActions } from './categories-slice'
import { errorHandler } from '../../utils/errors'

export const addCategory: StoreAction<CategoriesPayload> = ({ token, name, categoryType }) => {
  return async (dispatch, getState) => {
    try {
      const { data, status } = await axios.post<JSONResponse<CategoriesPayload>>(
        '/api/categories/add-category',
        { name, categoryType },
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

export const getCategories: StoreAction<CategoriesPayload> = ({ token }) => {
  return async (dispatch, getState) => {
    try {
      const { data, status } = await axios.get<JSONResponse<CategoriesPayload>>('/api/categories/get-categories', {
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

export const deleteCategory: StoreAction<CategoriesPayload> = ({ token, id }) => {
  return async (dispatch, getState) => {
    try {
      const { data, status } = await axios.delete<JSONResponse<CategoriesPayload>>(`/api/categories/delete-category?id=${id}`, {
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

export const updateCategory: StoreAction<CategoriesPayload> = ({ token, id, name, categoryType }) => {
  return async (dispatch, getState) => {
    try {
      const { data, status } = await axios.put<JSONResponse<CategoriesPayload>>(
        '/api/categories/update-category',
        { id, name, categoryType },
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
