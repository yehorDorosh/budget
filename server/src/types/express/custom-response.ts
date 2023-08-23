import { Send } from 'express-serve-static-core'
import { Response } from 'express'

import { ValidationError } from 'express-validator'

export enum ResCodes {
  ERORR,
  VALIDATION_ERROR,
  CREATE_USER,
  LOGIN,
  SEND_RESTORE_PASSWORD_EMAIL,
  RESET_PASSWORD
}

export interface JSONResponse<T = void> {
  message: string
  code: ResCodes
  payload?: T
  validationErrors?: ValidationError[]
  error?: {
    details?: unknown
    cause?: string
  }
}

export interface TypedResponse<T> extends Response {
  json: Send<T, this>
}

export type AppRes<T = void> = TypedResponse<JSONResponse<T>>
