import { UserId } from '../index'

declare global {
  namespace Express {
    export interface Request {
      userId?: UserId
    }
  }
}
