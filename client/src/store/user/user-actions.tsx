import axios from 'axios'
import { AppDispatch } from '..'

import { userActions } from './user-slice'

export const signUp = (email: string, password: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const { data, status } = await axios.post<JSONResponse<UserPayload>>('/api/user/signup', { email, password })
      if (status < 300 && data.payload && data.payload.user) {
        dispatch(userActions.setUserData(data.payload.user))
        if (data.payload.user.token) localStorage.setItem('token', data.payload.user.token)
      }
      return { data, status }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        return { error: err, data: err.response.data, status: err.response.status }
      }
      return { error: err }
    }
  }
}
