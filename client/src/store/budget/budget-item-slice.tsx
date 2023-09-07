import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface BudgetItem {
  id: number
  name: string
  value: number
  userDate: string
  category: {
    id: number
    name: string
    categoryType: string
  }
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
      const budgetItems = action.payload.map(
        (budgetItem): BudgetItem => ({
          ...budgetItem,
          value: +budgetItem.value,
          category: {
            ...budgetItem.category,
            id: +budgetItem.category.id
          }
        })
      )
      state.budgetItems = budgetItems
    }
  }
})

export const budgetItemActions = budgetItemSlice.actions

export default budgetItemSlice.reducer
