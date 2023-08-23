export {}

declare global {
  type UserId = number

  interface UserState {
    id: number | null
    email: string | null
    token: string | null
  }

  interface UserPayload {
    user: UserState
  }
}
