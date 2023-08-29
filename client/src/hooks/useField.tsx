import { useReducer, Reducer } from 'react'

export interface FieldState {
  value: string
  touched?: boolean
  isValid?: boolean
}

export type Action =
  | { type: 'clear' }
  | { type: 'set&check'; payload: FieldState; validation: ValidationFunction }
  | { type: 'set'; payload: FieldState }
  | { type: 'validate'; validation: ValidationFunction }

const fieldInitialState: FieldState = {
  value: '',
  touched: false,
  isValid: true
}

const useField = () => {
  const fieldReducer: Reducer<FieldState, Action> = (state, action) => {
    switch (action.type) {
      case 'set&check':
        return { ...state, value: action.payload.value, touched: action.payload.touched, isValid: action.validation(action.payload.value) }
      case 'set':
        return { ...state, value: action.payload.value, touched: action.payload.touched }
      case 'clear':
        return { ...state, value: '', touched: false, isValid: true }
      case 'validate':
        return { ...state, isValid: action.validation(state.value) }
      default:
        return state
    }
  }
  const [fieldState, fieldDispatch] = useReducer(fieldReducer, fieldInitialState)

  return {
    fieldState,
    fieldDispatch
  }
}

export default useField
