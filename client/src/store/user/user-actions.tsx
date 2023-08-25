import axios from 'axios'
import { AppDispatch } from '..'

import { ActionResult } from '../../types/actions/actions'

import { userActions } from './user-slice'

function errorHandler(err: any) {
  if (axios.isAxiosError(err) && err.response) {
    return { errorMsg: err.message, data: err.response.data, status: err.response.status }
  }
  return { error: err }
}

export const signUp = (email: string, password: string) => {
  return async (dispatch: AppDispatch): Promise<ActionResult<UserPayload>> => {
    try {
      const { data, status } = await axios.post<JSONResponse<UserPayload>>('/api/user/signup', { email, password })
      if (data.payload && data.payload.user) {
        dispatch(userActions.setUserData(data.payload.user))
        dispatch(userActions.login())
        if (data.payload.user.token) localStorage.setItem('token', data.payload.user.token)
      }
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}

export const getUserData = (token: string) => {
  return async (dispatch: AppDispatch): Promise<ActionResult<UserPayload>> => {
    try {
      const { data, status } = await axios.get<JSONResponse<UserPayload>>('/api/user/get-user', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.payload && data.payload.user) {
        if (!data.payload.user.token) {
          if (localStorage.getItem('token')) data.payload.user.token = localStorage.getItem('token')
        }
        dispatch(userActions.setUserData(data.payload.user))
        dispatch(userActions.login())
      }
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}
