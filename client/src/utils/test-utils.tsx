import React, { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ResCodes } from '../types/enum'
import { rest } from 'msw'
import store from '../store'
import { StoreAction } from '../types/store-actions'

export function RenderWithProviders({ children }: PropsWithChildren<{}>) {
  return (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
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
