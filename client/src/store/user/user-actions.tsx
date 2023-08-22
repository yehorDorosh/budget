import axios from 'axios'
import { AppDispatch } from '..'

import { userActions } from './user-slice'

export const signUp = (email: string, password: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const { data } = await axios.post('/api/user/signup', { email, password }, { headers: { 'Content-Type': 'application/json' } })
      dispatch(userActions.setUserData(data.user))
      localStorage.setItem('token', data.user.token)
    } catch (error) {
      console.log(error)
    }
  }
}
