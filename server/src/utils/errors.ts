import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'

type ErrorDetails = string | object | unknown
type ErrorHandler = {
  (errorData: { message?: string; details?: ErrorDetails; statusCode?: number }, next?: NextFunction): void
}

export class ProjectError extends Error {
  statusCode: number = 500
  details?: ErrorDetails

  constructor(message: string) {
    super(message)
  }
}

export const errorHandler: ErrorHandler = ({ message, details, statusCode }, next) => {
  const error = new ProjectError(message || 'Internal server error')
  if (statusCode) error.statusCode = statusCode
  error.details = details ?? undefined
  if (next) next(error)
  else throw error
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const expressErrorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ProjectError) {
    res.status(err.statusCode).json({ message: 'Internal server error', cause: err.message, details: err.details })
  } else {
    res.status(500).json({ message: 'Internal server error', cause: err.message })
  }
}

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION\n', err.stack)
  // close DB connection
  // log error
  process.exit(1)
})
