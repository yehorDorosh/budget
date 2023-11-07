import { UserState } from '../store/user/user-slice'
import { CategoriesState } from '../store/categories/categories-slice'
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

  interface BudgetItemPayload {
    budgetItems: BudgetItem[]
    budgetItem?: BudgetItem
  }

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

  interface MonthlyTrendPayload {
    aveExpenses: string | null
    aveIncomes: string | null
    aveSaved: string | null
    totalSaved: string | null
    monthlyExpenses: { month: string; total: string }[]
    monthlyIncomes: { month: string; total: string }[]
    maxTotal: string | null
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
