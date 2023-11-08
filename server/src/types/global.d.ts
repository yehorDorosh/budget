import { Category } from '../models/category'
import { BudgetItem } from '../models/budget-item'
import { CategoryType, QueryFilter } from './enums'

export {}

declare global {
  type UserId = number

  interface UserState {
    id: number | null
    email: string | null
    token: string | null
    isLogin?: boolean | null
  }

  interface CategoryRate {
    name: string
    sum: number
  }

  interface UserPayload {
    user: UserState
  }

  interface CategoriesPayload {
    categories: Category[]
  }

  interface BudgetItemsPayload {
    budgetItems: BudgetItem[]
    total: number | null
  }

  interface StatisticsPayload {
    sum: string | null
    expenses: string | null
    incomes: string | null
    categoriesRates: CategoryRate[]
  }

  interface MonthlyTrendPayload {
    aveExpenses: string | null
    aveIncomes: string | null
    aveSaved: string | null
    totalSaved: string | null
    monthlyExpenses: { month: string; total: string }[]
    monthlyIncomes: { month: string; total: string }[]
    maxTotal: string | null
  }

  interface BudgetItemsFilters {
    month?: string
    year?: string
    active?: QueryFilter
    name?: string
    categoryType?: CategoryType
    category?: number
    ignore?: boolean
    page?: number
    perPage?: number
    id?: number
  }
}
