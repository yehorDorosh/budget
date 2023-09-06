import axios from 'axios'
import * as jose from 'jose'

import { StoreAction, SimpleStoreAtion, EmailOrPassword } from '../../types/store-actions'
import { userActions } from './user-slice'
import { errorHandler } from '../../utils/errors'

export const loginAndAutoLogout: SimpleStoreAtion = (token: string) => {
  return (dispatch, getState) => {
    const autoLogoutTimer = getState().user.autoLogoutTimer
    const isLogin = getState().user.isLogin
    const { exp: expiryDate } = jose.decodeJwt(token)
    localStorage.setItem('token', token)

    if (!isLogin) dispatch(userActions.login())

    if (!autoLogoutTimer) {
      dispatch(
        userActions.setAutoLogoutTimer(
          setInterval(() => {
            // console.log(expiryDate! - Date.now() / 1000)
            if (expiryDate && Date.now() >= expiryDate * 1000) {
              dispatch(userActions.logout())
            }
          }, 1000)
        )
      )
    }
  }
}

export const signUp: StoreAction<UserPayload> = (email: string, password?: string | EmailOrPassword | number) => {
  return async (dispatch, getState) => {
    try {
      if (typeof password !== 'string') throw new Error('Password is not a string')
      const { data, status } = await axios.post<JSONResponse<UserPayload>>('/api/user/signup', { email, password })
      if (data.payload && data.payload.user) {
        dispatch(userActions.setUserData(data.payload.user))
        if (data.payload.user.token) {
          dispatch(loginAndAutoLogout(data.payload.user.token))
        }
      }
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}

export const getUserData: StoreAction<UserPayload> = (token: string) => {
  return async (dispatch) => {
    try {
      const { data, status } = await axios.get<JSONResponse<UserPayload>>('/api/user/get-user', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.payload && data.payload.user) {
        if (!data.payload.user.token) {
          if (localStorage.getItem('token')) data.payload.user.token = localStorage.getItem('token')
        }
        dispatch(userActions.setUserData(data.payload.user))
      }
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}

export const login: StoreAction<UserPayload> = (email: string, password?: string | EmailOrPassword | number) => {
  return async (dispatch, getState) => {
    try {
      if (typeof password !== 'string') throw new Error('Password is not a string')
      const { data, status } = await axios.post<JSONResponse<UserPayload>>('/api/user/login', { email, password })
      if (data.payload && data.payload.user) {
        dispatch(userActions.setUserData(data.payload.user))
        if (data.payload.user.token) {
          dispatch(loginAndAutoLogout(data.payload.user.token))
        }
      }
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}

export const getRestoreEmail: StoreAction = (email: string) => {
  return async () => {
    try {
      const { data, status } = await axios.post<JSONResponse>('/api/user/restore-password', { email })
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}

export const restorePassword: StoreAction = (token: string, newPassword?: string | EmailOrPassword | number) => {
  return async () => {
    try {
      if (typeof newPassword !== 'string') throw new Error('Password is not a string')
      const { data, status } = await axios.post<JSONResponse>(`/api/user/restore-password/${token}`, { newPassword })
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}

export const updateUser: StoreAction<UserPayload> = (token: string, payload?: EmailOrPassword | string | number) => {
  return async (dispatch) => {
    try {
      if (typeof payload === 'string') throw new Error('Payload type is not EmailOrPassword')
      const { data, status } = await axios.put<JSONResponse<UserPayload>>('/api/user/update-user', payload, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.payload && data.payload.user) {
        dispatch(userActions.setUserData(data.payload.user))
      }
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}

export const deleteUser: StoreAction = (token: string, password?: string | EmailOrPassword | number) => {
  return async () => {
    try {
      if (typeof password !== 'string') throw new Error('Password is not a string')
      const { data, status } = await axios.patch(`/api/user/delete-user`, { password }, { headers: { Authorization: `Bearer ${token}` } })
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}
