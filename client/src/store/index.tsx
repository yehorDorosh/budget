import { configureStore, createSlice } from '@reduxjs/toolkit'

import userSlice from './user/user-slice'
import categoriesSlice from './categories/categories-slice'
import budgetItemSlice from './budget/budget-item-slice'

const rootSlice = createSlice({
  name: 'root',
  initialState: {},
  reducers: {}
})

const store = configureStore({
  reducer: {
    root: rootSlice.reducer,
    user: userSlice,
    categories: categoriesSlice,
    budgetItem: budgetItemSlice
  }
})

export const rootActions = rootSlice.actions

// TS setup for toolkit
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
