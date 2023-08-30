import { UserState } from '../store/user/user-slice'
import { CategoriesState } from '../store/categories/categories-slice'

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

  interface ValidationError {
    location: string
    msg: string
    path: string
    type: string
    value: string
  }

  type ValidationFunction = (value: string, matchValue?: string) => boolean
}
