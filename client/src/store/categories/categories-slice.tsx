import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { LogType } from '../../types/enum'

export interface Category {
  id: number
  name: string
  logType: LogType
  created_at: string
  updated_at: string
}

export interface CategoriesState {
  categories: Category[]
}

const initialState: CategoriesState = {
  categories: []
}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory(state, action: PayloadAction<Category>) {
      state.categories.push(action.payload)
    },
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload
    }
  }
})

export const categoriesActions = categoriesSlice.actions

export default categoriesSlice.reducer
