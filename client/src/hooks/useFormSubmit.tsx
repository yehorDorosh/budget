import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { StoreAction, determineAxiosErrorPayload } from '../types/actions/actions'
import { FieldState } from './useField'
import { useAppDispatch } from './useReduxTS'
import { Action as UseFieldActions } from './useField'

/**
 * Check fields before submitting. If the fields are valid, dispatch the action and clear the fields.
 *
 * @param T - type of the action payload
 * @param fields - array of field states which are used to determine if the form is valid
 * @param fieldsDispatch - map of field dispatches and their validation functions. The dispatches are used to clear the fields after a successful submit and the validation functions are used to validate the fields before submitting.
 * @param action - action to dispatch. The action is dispatched if the form is valid. The action is expected to return a promise. Usually send a request to the server.
 * @param actionParams - action parameters.
 * @param callback - callback function. Called after a successful submit.
 * @returns - if the action returns an axios error, return the error. If the action returns a status code of 403, return the status code. If the action returns a status code of 300 or higher, navigate to the 500 page. Otherwise, return nothing.
 */

export type FormSubmit = <T>(
  fields: FieldState[],
  fieldsDispatch: Map<React.Dispatch<UseFieldActions>, ValidationFunction | null>,
  action: StoreAction<T>,
  actionParams: any[],
  callback: () => void
) => Promise<{ status: number } | void>

const useSubmit = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const submit: FormSubmit = async (fields, fieldsDispatch, action, actionParams, callback) => {
    for (let [fieldDispatch, validator] of fieldsDispatch) {
      if (!validator) continue
      fieldDispatch({ type: 'validate', validation: validator })
    }

    const isValid = fields.every((field) => field.isValid)
    const isTouched = fields.every((field) => field.touched)

    if (isValid && isTouched) {
      setIsLoading(true)
      const res = await dispatch(action(...actionParams))
      setIsLoading(false)
      if (determineAxiosErrorPayload(res)) {
        if (res.status && res.status === 403) return { status: res.status }
        if (res.status && res.status >= 300) navigate('/500', { state: { data: res } })
        return
      }

      for (let fieldDispatch of fieldsDispatch.keys()) {
        fieldDispatch({ type: 'clear' })
      }

      callback()
    }
  }

  return {
    submit,
    isLoading
  }
}

export default useSubmit
