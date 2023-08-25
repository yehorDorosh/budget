import { User } from '../../models/user'

export {}

declare global {
  namespace Express {
    export interface Request {
      userId?: UserId
      user?: User
    }
  }
}
