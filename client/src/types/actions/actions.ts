import { AppDispatch, RootState } from '../../store'

export function isAxiosErrorPayload<T = void>(toBeDetermined: ActionResult<T>): toBeDetermined is AxiosErrorPayload<T> {
  return toBeDetermined && (toBeDetermined as AxiosErrorPayload<T>).errorMsg !== undefined
}

export function isRegularErrorObject<T = void>(toBeDetermined: ActionResult<T>): toBeDetermined is RegularErrorObject {
  return toBeDetermined && (toBeDetermined as RegularErrorObject).error !== undefined
}

export function isActionPayload<T = void>(toBeDetermined: ActionResult<T>): toBeDetermined is ActionPayload<T> {
  return (
    toBeDetermined &&
    (toBeDetermined as ActionPayload<T>).data !== undefined &&
    (toBeDetermined as AxiosErrorPayload<T>).errorMsg === undefined &&
    (toBeDetermined as RegularErrorObject).error === undefined
  )
}

export function isEmailOrPassword(toBeDetermined: string | number | EmailOrPassword | undefined): toBeDetermined is EmailOrPassword {
  return (
    (toBeDetermined && (toBeDetermined as EmailOrPassword).email !== undefined) ||
    (toBeDetermined as EmailOrPassword).password !== undefined
  )
}

export type AxiosErrorPayload<T = void> = {
  errorMsg: string
  data: JSONResponse<T>
  status: number
}

export type RegularErrorObject = { error: Error }

export type ActionPayload<T = void> = {
  data: JSONResponse<T>
  status: number
}

export type ActionResult<T = void> = AxiosErrorPayload<T> | RegularErrorObject | ActionPayload<T>

export type EmailOrPassword = { email: string; password?: string } | { email?: string; password: string }
type ActionCreator<T = void> = (dispatch: AppDispatch, getState: () => RootState) => Promise<ActionResult<T>>
export type StoreActionParams = [string, (string | number | EmailOrPassword)?, string?, string?]
export type StoreAction<T = void> = {
  (token: string): ActionCreator<T>
  (email: string): ActionCreator<T>
  (email: string, password: string): ActionCreator<T>
  (token: string, newPassword: string): ActionCreator<T>
  (token: string, password: string): ActionCreator<T>
  (token: string, payload: EmailOrPassword): ActionCreator<T>
  (token: string, id: number): ActionCreator<T>
  (token: string, id: number, name: string): ActionCreator<T>
  (token: string, name: string, logType: string): ActionCreator<T>
  (token: string, id: number, name: string, logType: string): ActionCreator<T>
}
export type SimpleStoreAtion = (...arg: any) => (dispatch: AppDispatch, getState: () => RootState) => void
