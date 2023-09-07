import { Category } from '../models/category'
import { BudgetItem } from '../models/budget-item'

export {}

declare global {
  type UserId = number

  interface UserState {
    id: number | null
    email: string | null
    token: string | null
    isLogin?: boolean | null
  }

  interface UserPayload {
    user: UserState
  }

  interface CategoriesPayload {
    categories: Category[]
  }

  interface BudgetItemsPayload {
    budgetItems: BudgetItem[]
  }

  interface BudgetItemsFilters {
    month?: string
  }
}
