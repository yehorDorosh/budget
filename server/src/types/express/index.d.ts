export {}

declare global {
  namespace Express {
    export interface Request {
      userId?: UserId
      user?: Users
    }
  }
}
