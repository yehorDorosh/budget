import React, { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ResCodes } from '../types/enum'
import { rest } from 'msw'
import store from '../store'
import { StoreAction } from '../types/store-actions'
import { useAppDispatch } from '../hooks/useReduxTS'
import { userActions } from '../store/user/user-slice'
import ErrorBoundary from '../components/errors/ErrorBoundary'

function SetUserData() {
  const dispatch = useAppDispatch()
  dispatch(
    userActions.setUserData({
      id: 1,
      email: 'user@email.com',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEifQ.BQmWM1mXBfpTw_Tv-yR3qodI0OoRmrm3Tlz6ZR60Yi4',
      autoLogoutTimer: null
    })
  )
  return null
}

export function RenderWithProviders({ children, setUserData }: PropsWithChildren<{ setUserData?: boolean }>) {
  return (
    <Provider store={store}>
      {setUserData && <SetUserData />}
      <BrowserRouter>
        <ErrorBoundary>{children}</ErrorBoundary>
      </BrowserRouter>
    </Provider>
  )
}

export const handlers = [
  rest.post('/api/user/signup', async (req, res, ctx) => {
    const body = await req.json()

    if (body.email === 'already@exist.com') {
      return res(
        ctx.json({
          message: 'Validation failed',
          code: ResCodes.VALIDATION_ERROR,
          validationErrors: [
            { location: 'body', msg: 'E-mail address already exists!', path: 'email', type: 'field', value: 'already@exist.com' }
          ]
        }),
        ctx.status(422),
        ctx.delay(100)
      )
    }

    return res(
      ctx.json({
        message: 'Create new user.',
        code: ResCodes.CREATE_USER,
        payload: {
          user: {
            id: '1',
            email: 'user@email.com',
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEifQ.BQmWM1mXBfpTw_Tv-yR3qodI0OoRmrm3Tlz6ZR60Yi4'
          }
        }
      }),
      ctx.status(201),
      ctx.delay(100)
    )
  }),

  rest.post('/api/user/login', async (req, res, ctx) => {
    const body = await req.json()

    if (body.email === 'user@email.com' && body.password === '123') {
      return res(
        ctx.json({
          message: 'Login success.',
          code: ResCodes.LOGIN,
          payload: {
            user: {
              id: '1',
              email: 'user@email.com',
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEifQ.BQmWM1mXBfpTw_Tv-yR3qodI0OoRmrm3Tlz6ZR60Yi4'
            }
          }
        }),
        ctx.status(201),
        ctx.delay(100)
      )
    } else {
      return res(
        ctx.json({
          message: 'Wrong credentials',
          code: ResCodes.ERORR
        }),
        ctx.status(401),
        ctx.delay(100)
      )
    }
  }),

  rest.put('/api/user/update-user', async (req, res, ctx) => {
    const body = await req.json()

    if (body.email === 'user@email.com') {
      return res(
        ctx.json({
          message: 'Update user.',
          code: ResCodes.UPDATE_USER,
          payload: {
            user: {
              id: '1',
              email: body.email,
              token: null
            }
          }
        }),
        ctx.status(200),
        ctx.delay(100)
      )
    } else {
      return res(
        ctx.json({
          message: 'Feild to update user.',
          code: ResCodes.ERORR
        }),
        ctx.status(500),
        ctx.delay(100)
      )
    }
  }),

  rest.patch('/api/user/delete-user', async (req, res, ctx) => {
    const body = await req.json()

    if (body.password === '123') {
      return res(
        ctx.json({
          message: 'Delete user.',
          code: ResCodes.DELETE_USER
        }),
        ctx.status(200),
        ctx.delay(100)
      )
    } else {
      return res(
        ctx.json({
          message: 'Failed to delete user. Wrong password',
          code: ResCodes.ERORR
        }),
        ctx.status(401),
        ctx.delay(100)
      )
    }
  }),

  rest.post(
    '/api/user/restore-password/eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsImV4cCI6OTk5OTk5OTk5OX0.ff54M0aPirA6PkGxBcIxIQQIxKhEiOKED9SsFa4VXE8',
    async (req, res, ctx) => {
      return res(
        ctx.json({
          message: 'Password was restored.',
          code: ResCodes.RESET_PASSWORD
        }),
        ctx.status(200),
        ctx.delay(100)
      )
    }
  ),

  rest.post(
    '/api/user/restore-password/eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsImV4cCI6OTk5OTk5OTk5fQ.k6BPC1eOSJ-tFIIfRsEMkffrVxln6EjIRfURY2a5lZ0',
    async (req, res, ctx) => {
      return res(
        ctx.json({
          message: 'Failed to restore password.',
          code: ResCodes.ERORR
        }),
        ctx.status(401),
        ctx.delay(100)
      )
    }
  ),

  rest.post(
    '/api/user/restore-password/eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsImV4cCI6OTk5OTk5OTk5OX0.ff54M0aPirA6PkGxBcIxIQQIxKhEiOKED9SsFa4VXE7',
    async (req, res, ctx) => {
      return res(
        ctx.json({
          message: 'Failed to restore password.',
          code: ResCodes.ERORR,
          error: {
            cause: 'Failed to restore password.',
            details: {
              code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED',
              message: 'signature verification failed',
              name: 'JWSSignatureVerificationFailed'
            }
          }
        }),
        ctx.status(401),
        ctx.delay(100)
      )
    }
  ),

  rest.post('/api/user/restore-password', async (req, res, ctx) => {
    const body = await req.json()
    if (body.email === 'user@email.com') {
      return res(
        ctx.json({ message: 'Restore password email was sent.', code: ResCodes.SEND_RESTORE_PASSWORD_EMAIL }),
        ctx.status(200),
        ctx.delay(100)
      )
    }

    return res(
      ctx.json({
        message: 'Internal server error.',
        code: ResCodes.ERORR,
        error: {
          cause: 'Failed to send email to restore password. User not found.'
        }
      }),
      ctx.status(401),
      ctx.delay(100)
    )
  })
]

export function mockAction<T>(payload: T): StoreAction<T> {
  return jest.fn(() => async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(payload)
      }, 100)
    })
  }) as unknown as StoreAction<T>
}
