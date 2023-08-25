import axios from 'axios'
import { AppDispatch } from '..'

import { ActionResult } from '../../types/actions/actions'

import { userActions } from './user-slice'

export const signUp = (email: string, password: string) => {
  return async (dispatch: AppDispatch): Promise<ActionResult<UserPayload>> => {
    try {
      const { data, status } = await axios.post<JSONResponse<UserPayload>>('/api/user/signup', { email, password })
      if (status < 300 && data.payload && data.payload.user) {
        dispatch(userActions.setUserData(data.payload.user))
        if (data.payload.user.token) localStorage.setItem('token', data.payload.user.token)
      }
      return { data, status }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        return { errorMsg: err.message, data: err.response.data, status: err.response.status }
      }
      return { error: err }
    }
  }
}
