import { AppDispatch } from '../../store'

export function determineAxiosErrorPayload<T>(toBeDetermined: ActionResult<T>): toBeDetermined is AxiosErrorPayload {
  return (toBeDetermined as AxiosErrorPayload).errorMsg !== undefined
}

export type AxiosErrorPayload = {
  errorMsg: string
  data: JSONResponse<unknown>
  status: number
}

export type RegularErrorObject = { error: unknown }

export type ActionPayload<T> = {
  data: JSONResponse<T>
  status: number
}

export type ActionResult<T> = AxiosErrorPayload | RegularErrorObject | ActionPayload<T>

export type StoreAction<T> = (...arg: any) => (dispatch: AppDispatch) => Promise<ActionResult<T>>
