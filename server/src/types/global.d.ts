import { Category } from '../models/category'

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
}
