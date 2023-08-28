import { UserState } from '../store/user/user-slice'

export {}

declare global {
  interface JSONResponse<T> {
    message: string
    code: ResCodes
    payload?: T
    validationErrors?: ValidationError[]
    error?: {
      details?: unknown
      cause?: string
    }
  }

  enum ResCodes {
    ERORR,
    VALIDATION_ERROR,
    CREATE_USER,
    LOGIN,
    SEND_RESTORE_PASSWORD_EMAIL,
    RESET_PASSWORD,
    SEND_USER
  }

  interface UserPayload {
    user: UserState
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
