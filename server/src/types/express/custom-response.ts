import { Send } from 'express-serve-static-core'
import { Response } from 'express'

import { ValidationError } from 'express-validator'
import { ResCodes } from '../enums'

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
