export {}

declare module 'jsonwebtoken' {
  interface JwtPayload {
    userId: UserId
  }
}
