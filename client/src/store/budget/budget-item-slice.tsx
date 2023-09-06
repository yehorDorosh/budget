import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface BudgetItem {
  id: number
  name: string
  value: number
  userDate: Date
  categoryId: number
  created_at: string
  updated_at: string
}

export interface BudgetItemState {
  budgetItems: BudgetItem[]
}

const initialState: BudgetItemState = {
  budgetItems: []
}

const budgetItemSlice = createSlice({
  name: 'budget items',
  initialState,
  reducers: {
    setBudgetItems(state, action: PayloadAction<BudgetItem[]>) {
      state.budgetItems = action.payload
    }
  }
})

export const budgetItemActions = budgetItemSlice.actions

export default budgetItemSlice.reducer
