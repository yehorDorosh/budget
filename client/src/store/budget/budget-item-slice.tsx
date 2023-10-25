import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { formatDateYearMonth, getCurrentYearMonth } from '../../utils/date'
import { CategoryType, QueryFilter } from '../../types/enum'

function parseBudgetItems(payload: BudgetItem[]) {
  return payload.map(
    (budgetItem): BudgetItem => ({
      ...budgetItem,
      value: +budgetItem.value,
      category: {
        ...budgetItem.category,
        id: +budgetItem.category.id
      }
    })
  )
}

export interface BudgetItem {
  id: number
  name: string
  value: number
  userDate: string
  ignore: boolean
  category: {
    id: number
    name: string
    categoryType: CategoryType
  }
}

export interface BudgetItemsFilters {
  month?: string
  year?: string
  active?: QueryFilter
  name?: string
  categoryType?: CategoryType
  category?: number
  ignore?: boolean
  page?: number
  perPage?: number
}

export interface BudgetItemState {
  budgetItems: BudgetItem[]
  filters: BudgetItemsFilters
  trendBudgetItems: BudgetItem[]
  onChangeBudgetItems: boolean
}

const initialState: BudgetItemState = {
  budgetItems: [],
  trendBudgetItems: [],
  filters: {
    month: getCurrentYearMonth(),
    year: new Date().getFullYear().toString(),
    active: QueryFilter.MONTH,
    ignore: false,
    page: 1,
    perPage: 10
  },
  onChangeBudgetItems: false
}

const budgetItemSlice = createSlice({
  name: 'budget items',
  initialState,
  reducers: {
    setBudgetItems(state, action: PayloadAction<BudgetItem[]>) {
      state.budgetItems = parseBudgetItems(action.payload)
    },
    setTrendBudgetItems(state, action: PayloadAction<BudgetItem[]>) {
      state.trendBudgetItems = parseBudgetItems(action.payload)
    },
    setFilterMonth(state, action: PayloadAction<string>) {
      state.filters.month = action.payload
    },
    increaseMonth(state) {
      if (!state.filters.month) return
      const date = new Date(state.filters.month)
      date.setMonth(date.getMonth() + 1)
      state.filters.month = formatDateYearMonth(date)
    },
    decreaseMonth(state) {
      if (!state.filters.month) return
      const date = new Date(state.filters.month)
      date.setMonth(date.getMonth() - 1)
      state.filters.month = formatDateYearMonth(date)
    },
    increaseYear(state) {
      if (!state.filters.year) return
      state.filters.year = String(+state.filters.year + 1)
    },
    decreaseYear(state) {
      if (!state.filters.year) return
      state.filters.year = String(+state.filters.year - 1)
    },
    setFilterYear(state, action: PayloadAction<string>) {
      state.filters.year = action.payload
    },
    setActiveFilter(state, action: PayloadAction<QueryFilter>) {
      state.filters.active = action.payload
    },
    setFilterName(state, action: PayloadAction<string>) {
      state.filters.name = action.payload
    },
    setFilterCategoryType(state, action: PayloadAction<CategoryType | string>) {
      if (action.payload === CategoryType.EXPENSE || action.payload === CategoryType.INCOME) {
        state.filters.categoryType = action.payload
      } else {
        delete state.filters.categoryType
      }
    },
    setFilterCategory(state, action: PayloadAction<string>) {
      state.filters.category = +action.payload
    },
    setFilterIgnore(state, action: PayloadAction<boolean>) {
      state.filters.ignore = action.payload
    },
    incrementPage(state) {
      if (!state.filters.page) return
      state.filters.page++
    },
    resetPage(state) {
      state.filters.page = 1
    },
    onChangeBudgetItems(state) {
      state.onChangeBudgetItems = !state.onChangeBudgetItems
    }
  }
})

export const budgetItemActions = budgetItemSlice.actions

export default budgetItemSlice.reducer
