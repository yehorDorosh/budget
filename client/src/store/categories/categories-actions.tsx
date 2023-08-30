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
