import { AppDispatch, RootState } from '../../store'
import { BudgetItemsFilters } from '../../store/budget/budget-item-slice'
import { ReducerType } from '../enum'

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

export interface StoreActionData {
  token?: string
  id?: number
  name?: string
  categoryType?: string
  payload?: EmailOrPassword
  email?: string
  password?: string
  value?: number
  userDate?: string
  categoryId?: number
  filters?: BudgetItemsFilters
  ignore?: boolean
  dbId?: number
  dateFrom?: string
  dateTo?: string
  year?: number
}

export type StoreAction<T = void> = (
  data: StoreActionData,
  reducerType?: ReducerType
) => (dispatch: AppDispatch, getState: () => RootState) => Promise<ActionResult<T>>

export type SimpleStoreAction = (data: StoreActionData) => (dispatch: AppDispatch, getState: () => RootState) => void
