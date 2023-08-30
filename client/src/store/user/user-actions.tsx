import axios from 'axios'
import * as jose from 'jose'

import { StoreAction, SimpleStoreAtion } from '../../types/actions/actions'

import { userActions } from './user-slice'

function errorHandler(err: any) {
  if (axios.isAxiosError(err) && err.response) {
    return { errorMsg: err.message, data: err.response.data, status: err.response.status }
  }
  return { error: err }
}

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

export const signUp: StoreAction<UserPayload> = (email: string, password: string) => {
  return async (dispatch, getState) => {
    try {
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

export const login: StoreAction<UserPayload> = (email: string, password: string) => {
  return async (dispatch, getState) => {
    try {
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

export const restorePassword: StoreAction = (token: string, newPassword: string) => {
  return async () => {
    try {
      const { data, status } = await axios.post<JSONResponse>(`/api/user/restore-password/${token}`, { newPassword })
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}

export const updateUser: StoreAction<UserPayload> = (
  token: string,
  payload: { email: string; password?: string } | { email?: string; password: string }
) => {
  return async (dispatch) => {
    try {
      const { data, status } = await axios.post<JSONResponse<UserPayload>>('/api/user/update-user', payload, {
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

export const deleteUser: StoreAction = (token: string, password: string) => {
  return async () => {
    try {
      const { data, status } = await axios.patch(`/api/user/delete-user`, { password }, { headers: { Authorization: `Bearer ${token}` } })
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}
