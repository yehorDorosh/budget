import store from '..'
import { userActions } from './user-slice'
import { ResCodes } from '../../types/enum'
import { loginAndAutoLogout, signUp, login, getUserData, getRestoreEmail, restorePassword, updateUser, deleteUser } from './user-actions'
import { setupServer } from 'msw/node'
import { handlers } from '../../utils/test-utils'
import axios from 'axios'

describe('User Store', () => {
  describe('reducers', () => {
    const user = { id: 1, email: 'email', token: 'token', autoLogoutTimer: null }

    afterEach(() => {
      store.dispatch(userActions.setUserData({ id: null, email: null, token: null, autoLogoutTimer: null }))
      store.dispatch(userActions.logout())
    })

    test('Should set user data.', () => {
      store.dispatch(userActions.setUserData(user))

      expect(store.getState().user.id).toEqual(1)
      expect(store.getState().user.email).toEqual('email')
      expect(store.getState().user.token).toEqual('token')
    })

    test('Should set user data except token.', () => {
      store.dispatch(userActions.setUserData({ ...user, token: null }))

      expect(store.getState().user.id).toEqual(1)
      expect(store.getState().user.email).toEqual('email')
      expect(store.getState().user.token).toEqual(null)
    })

    test('Should set user login.', () => {
      store.dispatch(userActions.login())

      expect(store.getState().user.isLogin).toEqual(true)
    })

    test('Should set user logout.', () => {
      const clearIntervalMock = jest.spyOn(global, 'clearInterval')
      const timer = setInterval(() => {}, 1000)
      store.dispatch(userActions.setUserData(user))
      store.dispatch(userActions.setAutoLogoutTimer(timer))
      window.localStorage.setItem('token', 'token')
      store.dispatch(userActions.logout())

      expect(window.localStorage.getItem('token')).toEqual(null)
      expect(store.getState().user.isLogin).toEqual(false)
      expect(store.getState().user.id).toEqual(null)
      expect(store.getState().user.email).toEqual(null)
      expect(store.getState().user.token).toEqual(null)
      expect(store.getState().user.autoLogoutTimer).toEqual(null)
      expect(clearIntervalMock).toHaveBeenCalledWith(timer)

      jest.restoreAllMocks()
    })

    test('Should set auto logout timer.', () => {
      const timer = setInterval(() => {}, 1000)
      store.dispatch(userActions.setAutoLogoutTimer(timer))

      expect(store.getState().user.autoLogoutTimer).toEqual(timer)
    })
  })

  describe('actions', () => {
    const dispatch = store.dispatch
    const server = setupServer(...handlers)
    let token = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsImV4cCI6OTk5OTk5OTk5OX0.ff54M0aPirA6PkGxBcIxIQQIxKhEiOKED9SsFa4VXE8'

    afterEach(() => {
      server.resetHandlers()
      store.dispatch(userActions.setUserData({ id: null, email: null, token: null, autoLogoutTimer: null }))
      store.dispatch(userActions.logout())
    })

    beforeAll(() => {
      server.listen()
    })

    afterAll(() => {
      server.close()
    })

    test('loginAndAutoLogout should logout if no token.', async () => {
      const dispatchMock = jest.spyOn(store, 'dispatch')
      const loginAndAutoLogoutAction = loginAndAutoLogout({ token: '' })
      await loginAndAutoLogoutAction(store.dispatch, store.getState)

      expect(dispatchMock).toHaveBeenCalledWith(userActions.logout())
      jest.restoreAllMocks()
    })

    test('loginAndAutoLogout should login if token exist and save it t localStorage', async () => {
      const dispatchMock = jest.spyOn(store, 'dispatch')
      const loginAndAutoLogoutAction = loginAndAutoLogout({ token })
      await loginAndAutoLogoutAction(store.dispatch, store.getState)

      expect(dispatchMock).toHaveBeenCalledWith(userActions.login())
      expect(window.localStorage.getItem('token')).toEqual(token)

      jest.restoreAllMocks()
    })

    test('Auto logout timer should start.', async () => {
      await dispatch(loginAndAutoLogout({ token }))

      expect(store.getState().user.autoLogoutTimer).not.toEqual(null)
    })

    test('Should login after signUp.', async () => {
      await dispatch(signUp({ email: 'email', password: 'password' }))

      expect(store.getState().user.isLogin).toEqual(true)
      expect(store.getState().user.token).not.toEqual(null)
    })

    test('Should return axios error if signUp failed.', async () => {
      jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error('test error'))

      const res = await dispatch(signUp({ email: 'email', password: 'password' }))

      expect(res).toEqual({
        error: new Error('test error')
      })

      jest.spyOn(axios, 'post').mockRestore()
    })

    test('Should get user data.', async () => {
      await dispatch(getUserData({ token }))

      expect(store.getState().user.id).toEqual('1')
      expect(store.getState().user.email).toEqual('email')
    })

    test('Should return axios error if getUserData failed.', async () => {
      jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('test error'))

      const res = await dispatch(getUserData({ token }))

      expect(res).toEqual({
        error: new Error('test error')
      })

      jest.spyOn(axios, 'get').mockRestore()
    })

    test('Should login after login.', async () => {
      await dispatch(login({ email: 'user@email.com', password: '123' }))

      expect(store.getState().user.isLogin).toEqual(true)
      expect(store.getState().user.token).not.toEqual(null)
      expect(store.getState().user.email).toEqual('user@email.com')
      expect(store.getState().user.id).toEqual('1')
    })

    test('Should return axios error if login failed.', async () => {
      jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error('test error'))

      const res = await dispatch(login({ email: 'email', password: 'password' }))

      expect(res).toEqual({
        error: new Error('test error')
      })

      jest.spyOn(axios, 'post').mockRestore()
    })

    test('getRestoreEmail should return 200', async () => {
      const res = await dispatch(getRestoreEmail({ email: 'user@email.com' }))

      expect(res).toEqual({
        data: { message: 'Restore password email was sent.', code: ResCodes.SEND_RESTORE_PASSWORD_EMAIL },
        status: 200
      })
    })

    test('Should return axios error if getRestoreEmail failed.', async () => {
      jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error('test error'))

      const res = await dispatch(getRestoreEmail({ email: 'email' }))

      expect(res).toEqual({
        error: new Error('test error')
      })

      jest.spyOn(axios, 'post').mockRestore()
    })

    test('restorePassword should return 200', async () => {
      const res = await dispatch(
        restorePassword({
          token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsImV4cCI6OTk5OTk5OTk5OX0.ff54M0aPirA6PkGxBcIxIQQIxKhEiOKED9SsFa4VXE8',
          password: '123'
        })
      )

      expect(res).toEqual({
        data: { message: 'Password was restored.', code: ResCodes.RESET_PASSWORD },
        status: 200
      })
    })

    test('Should return axios error if restorePassword failed.', async () => {
      jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error('test error'))

      const res = await dispatch(
        restorePassword({
          token,
          password: '123'
        })
      )

      expect(res).toEqual({
        error: new Error('test error')
      })

      jest.spyOn(axios, 'post').mockRestore()
    })

    test('updateUser should return new user data', async () => {
      await dispatch(updateUser({ token, payload: { email: 'user@email.com' } }))

      expect(store.getState().user.email).toEqual('user@email.com')
    })

    test('Should return axios error if updateUser failed.', async () => {
      jest.spyOn(axios, 'put').mockRejectedValueOnce(new Error('test error'))

      const res = await dispatch(updateUser({ token, payload: { email: 'email' } }))

      expect(res).toEqual({
        error: new Error('test error')
      })

      jest.spyOn(axios, 'put').mockRestore()
    })

    test('deleteUser should return user id.', async () => {
      const res = await dispatch(deleteUser({ token, password: '123' }))

      expect(res).toEqual({
        data: { message: 'Delete user.', code: ResCodes.DELETE_USER },
        status: 200
      })
    })

    test('Should return axios error if deleteUser failed.', async () => {
      jest.spyOn(axios, 'patch').mockRejectedValueOnce(new Error('test error'))

      const res = await dispatch(deleteUser({ token, password: '123' }))

      expect(res).toEqual({
        error: new Error('test error')
      })

      jest.spyOn(axios, 'patch').mockRestore()
    })
  })
})
