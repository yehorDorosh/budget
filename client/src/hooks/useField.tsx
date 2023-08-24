import { useReducer, Reducer } from 'react'

interface FieldSate {
  value: string
  touched?: boolean
  isValid?: boolean
}

type Action =
  | { type: 'clear' }
  | { type: 'set'; payload: FieldSate; validation: (value: string) => boolean }
  | { type: 'validate'; validation: (value: string) => boolean }

const fieldInitialState: FieldSate = {
  value: '',
  touched: false,
  isValid: true
}

const useField = () => {
  const fieldReducer: Reducer<FieldSate, Action> = (state, action) => {
    switch (action.type) {
      case 'set':
        return { ...state, value: action.payload.value, touched: action.payload.touched, isValid: action.validation(action.payload.value) }
      case 'clear':
        return { ...state, value: '', touched: false, isValid: true }
      case 'validate':
        return { ...state, isValid: action.validation(state.value) }
      default:
        return state
    }
  }
  const [fieldState, filedDispatch] = useReducer(fieldReducer, fieldInitialState)

  return {
    fieldState,
    filedDispatch
  }
}

export default useField
