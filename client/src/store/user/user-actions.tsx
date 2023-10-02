import axios from 'axios'
import * as jose from 'jose'

import { StoreAction, SimpleStoreAtion } from '../../types/store-actions'
import { userActions } from './user-slice'
import { errorHandler } from '../../utils/errors'

export const loginAndAutoLogout: SimpleStoreAtion = ({ token }) => {
  return (dispatch, getState) => {
    if (!token) return dispatch(userActions.logout())

    const autoLogoutTimer = getState().user.autoLogoutTimer
    const isLogin = getState().user.isLogin
    const { exp: expiryDate } = jose.decodeJwt(token)
    localStorage.setItem('token', token)

    if (!isLogin) dispatch(userActions.login())

    if (!autoLogoutTimer && expiryDate) {
      dispatch(
        userActions.setAutoLogoutTimer(
          setInterval(() => {
            // console.log(expiryDate! - Date.now() / 1000)
            if (Date.now() >= expiryDate * 1000) {
              dispatch(userActions.logout())
            }
          }, 1000)
        )
      )
    }
  }
}

export const signUp: StoreAction<UserPayload> = ({ email, password }) => {
  return async (dispatch, getState) => {
    try {
      const { data, status } = await axios.post<JSONResponse<UserPayload>>('/api/user/signup', { email, password })
      if (data.payload && data.payload.user) {
        dispatch(userActions.setUserData(data.payload.user))
        if (data.payload.user.token) {
          dispatch(loginAndAutoLogout({ token: data.payload.user.token }))
        }
      }
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}

export const getUserData: StoreAction<UserPayload> = ({ token }) => {
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

export const login: StoreAction<UserPayload> = ({ email, password }) => {
  return async (dispatch, getState) => {
    try {
      const { data, status } = await axios.post<JSONResponse<UserPayload>>('/api/user/login', { email, password })
      if (data.payload && data.payload.user) {
        dispatch(userActions.setUserData(data.payload.user))
        if (data.payload.user.token) {
          dispatch(loginAndAutoLogout({ token: data.payload.user.token }))
        }
      }
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}

export const getRestoreEmail: StoreAction = ({ email }) => {
  return async () => {
    try {
      const { data, status } = await axios.post<JSONResponse>('/api/user/restore-password', { email })
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}

export const restorePassword: StoreAction = ({ token, password }) => {
  return async () => {
    try {
      const { data, status } = await axios.post<JSONResponse>(`/api/user/restore-password/${token}`, { password })
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}

export const updateUser: StoreAction<UserPayload> = ({ token, payload }) => {
  return async (dispatch) => {
    try {
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

export const deleteUser: StoreAction = ({ token, password }) => {
  return async () => {
    try {
      const { data, status } = await axios.patch(`/api/user/delete-user`, { password }, { headers: { Authorization: `Bearer ${token}` } })
      return { data, status }
    } catch (err) {
      return errorHandler(err)
    }
  }
}
