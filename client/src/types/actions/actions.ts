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

export type StoreAction<T = void> = (...arg: any) => (dispatch: AppDispatch, getState: () => RootState) => Promise<ActionResult<T>>
export type SimpleStoreAtion = (...arg: any) => (dispatch: AppDispatch, getState: () => RootState) => void
