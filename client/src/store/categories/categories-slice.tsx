import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface CategoriesState {
  categories: string[]
}

const initialState: CategoriesState = {
  categories: []
}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory(state, action: PayloadAction<string>) {
      state.categories.push(action.payload)
    },
    setCategories(state, action: PayloadAction<string[]>) {
      state.categories = action.payload
    }
  }
})

export const categoriesActions = categoriesSlice.actions

export default categoriesSlice.reducer
