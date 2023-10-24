import { UserState } from '../store/user/user-slice'
import { CategoriesState } from '../store/categories/categories-slice'
import { BudgetItemState } from '../store/budget/budget-item-slice'
import { WeatherState } from '../store/weather/weather-slice'

export {}

declare global {
  interface JSONResponse<T = void> {
    message: string
    code: ResCodes
    payload?: T
    validationErrors?: ValidationError[]
    error?: {
      details?: unknown
      cause?: string
    }
  }

  interface UserPayload {
    user: UserState
  }

  type CategoriesPayload = CategoriesState
  type BudgetItemPayload = BudgetItemState
  type WeatherPayload = WeatherState

  interface CategoryRate {
    name: string
    sum: number
  }

  interface StatisticsPayload {
    sum: string | null
    expenses: string | null
    incomes: string | null
    categoriesRates: CategoryRate[]
  }

  interface ValidationError {
    location: string
    msg: string
    path: string
    type: string
    value: string
  }

  type ValidationFunction = (value: string, matchValue?: string) => boolean
}
