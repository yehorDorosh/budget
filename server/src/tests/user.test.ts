import request from 'supertest'
import app from '../index'
import { ResCodes } from '../types/enums/index'
import { BudgetDataSource } from '../db/data-source'
import { Mock, describe, beforeAll, vi, test, afterAll, expect } from 'vitest'
import bcrypt from 'bcryptjs'
import { transport } from '../utils/email'
import * as jose from 'jose'

describe('userAPI', () => {
  const originalConsole = console
  const mockUser = { id: 2, email: 'user@email.com', token: 'token', password: 'Zaq12wsx' }

  beforeAll(() => {
    vi.mock('typeorm', async () => {
      const actual = await vi.importActual('typeorm')

      const DataSource = vi.fn()
      DataSource.prototype.manager = {
        findOneBy: vi.fn(),
        findOne: vi.fn(),
        save: vi.fn(),
        delete: vi.fn()
      }
      DataSource.prototype.initialize = vi.fn()

      return { ...(actual as object), DataSource }
    })

    vi.mock('bcryptjs', async () => {
      const actual: { default?: object } = await vi.importActual('bcryptjs')

      if (actual && typeof actual === 'object') {
        return {
          default: {
            ...actual.default,
            compare: vi.fn()
          }
        }
      }
    })

    vi.mock('../utils/email.ts', async () => {
      const actual = await vi.importActual('../utils/email.ts')

      return {
        ...(actual as object),
        transport: {
          sendMail: vi.fn()
        }
      }
    })

    vi.mock('jose', async () => {
      const actual = await vi.importActual('jose')

      return {
        ...(actual as object),
        jwtVerify: vi.fn()
      }
    })
  })

  afterAll(() => {
    vi.clearAllMocks()
    Object.defineProperty(global, 'console', { value: originalConsole })
  })

  describe('signup', () => {
    test('Should create and return new user with status 201.', async () => {
      ;(BudgetDataSource.manager.findOneBy as Mock).mockResolvedValue(null)
      ;(BudgetDataSource.manager.save as Mock).mockResolvedValue(mockUser)
      const response = await request(app).post('/api/user/signup').send({ email: mockUser.email, password: mockUser.password })

      expect(response.status).toBe(201)
      expect(response.body).toEqual({
        message: 'Create new user.',
        code: ResCodes.CREATE_USER,
        payload: { user: { ...mockUser, token: expect.any(String), password: undefined } }
      })
    })

    test('Should return validation error with status 422, because of invalid email.', async () => {
      const response = await request(app).post('/api/user/signup').send({ email: 'invalid', password: mockUser.password })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        message: 'SignUp validation failed.',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [{ location: 'body', msg: 'Invalid value', path: 'email', type: 'field', value: '@invalid' }]
      })
    })

    test('Should return validation error with status 422, because of invalid password.', async () => {
      const response = await request(app).post('/api/user/signup').send({ email: mockUser.email, password: 'invalid' })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        message: 'SignUp validation failed.',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [
          {
            location: 'body',
            msg: 'Invalid value',
            path: 'password',
            type: 'field',
            value: 'invalid'
          }
        ]
      })
    })

    test('Should return validation error with status 422, because of email already exist.', async () => {
      ;(BudgetDataSource.manager.findOneBy as Mock).mockResolvedValue(mockUser)
      const response = await request(app).post('/api/user/signup').send({ email: mockUser.email, password: mockUser.password })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        message: 'SignUp validation failed.',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [{ location: 'body', msg: 'E-mail address already exists!', path: 'email', type: 'field', value: mockUser.email }]
      })
    })

    test('Should return error with status 500, because of DB error.', async () => {
      const mockConsole = { error: vi.fn() }
      Object.defineProperty(global, 'console', { value: mockConsole })
      ;(BudgetDataSource.manager.findOneBy as Mock).mockResolvedValue(null)
      ;(BudgetDataSource.manager.save as Mock).mockRejectedValue(new Error('DB error'))
      const response = await request(app).post('/api/user/signup').send({ email: mockUser.email, password: mockUser.password })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: { cause: 'Failed to create new user.', details: 'DB error' }
      })

      Object.defineProperty(global, 'console', { value: originalConsole })
    })
  })

  describe('login', () => {
    test('Should return user state with status 200.', async () => {
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValue(mockUser)
      ;(bcrypt.compare as Mock).mockResolvedValue(true)

      const response = await request(app).post('/api/user/login').send({ email: mockUser.email, password: mockUser.password })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        message: 'Login success.',
        code: ResCodes.LOGIN,
        payload: { user: { ...mockUser, token: expect.any(String), password: undefined } }
      })
    })

    test('Should return validation error with status 422, because of invalid email.', async () => {
      const response = await request(app).post('/api/user/login').send({ password: mockUser.password })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        message: 'Login validation failed.',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [{ location: 'body', msg: 'Invalid value', path: 'email', type: 'field', value: '' }]
      })
    })

    test('Should return validation error with status 422, because of invalid password.', async () => {
      const response = await request(app).post('/api/user/login').send({ email: mockUser.email })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        message: 'Login validation failed.',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [{ location: 'body', msg: 'Invalid value', path: 'password', type: 'field', value: '' }]
      })
    })

    test('Should return error with status 401, because of invalid email.', async () => {
      const mockConsole = { error: vi.fn() }
      Object.defineProperty(global, 'console', { value: mockConsole })
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValue(null)
      const response = await request(app).post('/api/user/login').send({ email: 'no-user@email.com', password: mockUser.password })

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: { cause: 'Failed to login. User not found.', details: '' }
      })
    })

    test('Should return error with status 401, because of invalid password.', async () => {
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValue(mockUser)
      ;(bcrypt.compare as Mock).mockResolvedValue(false)

      const response = await request(app).post('/api/user/login').send({ email: mockUser.email, password: 'invalid' })

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: { cause: 'Failed to login. Wrong password.', details: '' }
      })
    })

    test('Should return error with status 500, because of DB error.', async () => {
      ;(BudgetDataSource.manager.findOne as Mock).mockRejectedValue(new Error('DB error'))
      const response = await request(app).post('/api/user/login').send({ email: mockUser.email, password: mockUser.password })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: { cause: 'Failed to login.', details: 'DB error' }
      })

      Object.defineProperty(global, 'console', { value: originalConsole })
    })
  })

  describe('sendRestorePasswordEmail', () => {
    test('Should send email with status 200.', async () => {
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValue(mockUser)
      ;(transport.sendMail as Mock).mockResolvedValue(undefined)
      const response = await request(app).post('/api/user/restore-password').send({ email: mockUser.email })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        message: 'Restore password email was sent.',
        code: ResCodes.SEND_RESTORE_PASSWORD_EMAIL
      })
    })

    test('Should return validation error with status 422, because of invalid email.', async () => {
      const response = await request(app).post('/api/user/restore-password').send({ email: '' })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        message: 'Restore password validation failed.',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [{ location: 'body', msg: 'Invalid value', path: 'email', type: 'field', value: '' }]
      })
    })

    test('Should return error with status 401, because of email does not exist.', async () => {
      const mockConsole = { error: vi.fn() }
      Object.defineProperty(global, 'console', { value: mockConsole })
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValue(null)
      const response = await request(app).post('/api/user/restore-password').send({ email: mockUser.email })

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: { cause: 'Failed to send email to restore password. User not found.', details: '' }
      })
    })

    test('Should return error with status 500, because of DB error.', async () => {
      ;(BudgetDataSource.manager.findOne as Mock).mockRejectedValue(new Error('DB error'))
      const response = await request(app).post('/api/user/restore-password').send({ email: mockUser.email })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: { cause: 'Failed to send email to restore password.', details: 'DB error' }
      })
    })

    test('Should return error with status 500, because of email sending was failed.', async () => {
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValue(mockUser)
      ;(transport.sendMail as Mock).mockRejectedValue(new Error('Email error'))
      const response = await request(app).post('/api/user/restore-password').send({ email: mockUser.email })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: { cause: 'Failed to send email to restore password.', details: 'Email error' }
      })

      Object.defineProperty(global, 'console', { value: originalConsole })
    })
  })

  describe('restorePassword', () => {
    test('Should restore password with status 200.', async () => {
      ;(jose.jwtVerify as Mock).mockResolvedValue({ payload: { userId: mockUser.id } })
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValue(mockUser)
      ;(BudgetDataSource.manager.save as Mock).mockResolvedValue(mockUser)

      const response = await request(app).post('/api/user/restore-password/token').send({ password: mockUser.password })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        message: 'Password was restored.',
        code: ResCodes.RESET_PASSWORD
      })
    })

    test('Should return validation error with status 422, because of invalid password.', async () => {
      const response = await request(app).post('/api/user/restore-password/token').send({ password: 'invalid' })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        message: 'Restore password validation failed.',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [
          {
            location: 'body',
            msg: 'Invalid value',
            path: 'password',
            type: 'field',
            value: 'invalid'
          }
        ]
      })
    })

    test('Should return error with status 401, because of invalid token.', async () => {
      const mockConsole = { error: vi.fn() }
      Object.defineProperty(global, 'console', { value: mockConsole })
      ;(jose.jwtVerify as Mock).mockResolvedValue(null)
      const response = await request(app).post('/api/user/restore-password/token').send({ password: mockUser.password })

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: { cause: 'Failed to restore password. Not authenticated.', details: 'Invalid token' }
      })
    })

    test('Should return error with status 403, because of user does not exist.', async () => {
      ;(jose.jwtVerify as Mock).mockResolvedValue({ payload: { userId: mockUser.id } })
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValue(null)
      const response = await request(app).post('/api/user/restore-password/token').send({ password: mockUser.password })

      expect(response.status).toBe(403)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: { cause: 'Failed to restore password. User not found.', details: '' }
      })
    })

    test('Should return error with status 401, because of DB error.', async () => {
      ;(jose.jwtVerify as Mock).mockResolvedValue({ payload: { userId: mockUser.id } })
      ;(BudgetDataSource.manager.findOne as Mock).mockRejectedValue(new Error('DB error'))
      const response = await request(app).post('/api/user/restore-password/token').send({ password: mockUser.password })

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: { cause: 'Failed to restore password.', details: 'DB error' }
      })

      Object.defineProperty(global, 'console', { value: originalConsole })
    })
  })

  describe('getUserInfo', () => {
    test('Should return user info with status 200.', async () => {
      ;(jose.jwtVerify as Mock).mockResolvedValue({ payload: { userId: mockUser.id } })
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValue(mockUser)

      const response = await request(app).get('/api/user/get-user').set('Authorization', 'Bearer token')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        message: 'User info was sent successfully.',
        code: ResCodes.SEND_USER,
        payload: { user: { ...mockUser, token: null, password: undefined } }
      })
    })

    test('Should return error with status 401, because of no Authorization header.', async () => {
      const mockConsole = { error: vi.fn() }
      Object.defineProperty(global, 'console', { value: mockConsole })

      const response = await request(app).get('/api/user/get-user')

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: { cause: 'Not authenticated. Invalid Authorization header.', details: '' }
      })
    })

    test('Should return error with status 401, because of invalid token.', async () => {
      ;(jose.jwtVerify as Mock).mockRejectedValue(new Error('Invalid token'))

      const response = await request(app).get('/api/user/get-user').set('Authorization', 'Bearer token')

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: { cause: 'Not authenticated.  Invalid token.', details: 'Invalid token' }
      })
    })

    test('Should return error with status 401, because of invalid decoded token data.', async () => {
      ;(jose.jwtVerify as Mock).mockResolvedValue(null)

      const response = await request(app).get('/api/user/get-user').set('Authorization', 'Bearer token')

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: { cause: 'Failed to authenticate. Invalid token.', details: '' }
      })
    })

    test('Should return error with status 403, because of user does not exist.', async () => {
      ;(jose.jwtVerify as Mock).mockResolvedValue({ payload: { userId: mockUser.id } })
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValue(null)

      const response = await request(app).get('/api/user/get-user').set('Authorization', 'Bearer token')

      expect(response.status).toBe(403)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: { cause: 'Failed to authenticate. User not found.', details: '' }
      })
    })

    test('Should return error with status 403, because of DB error.', async () => {
      ;(jose.jwtVerify as Mock).mockResolvedValue({ payload: { userId: mockUser.id } })
      ;(BudgetDataSource.manager.findOne as Mock).mockRejectedValue(new Error('DB error'))

      const response = await request(app).get('/api/user/get-user').set('Authorization', 'Bearer token')

      expect(response.status).toBe(403)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: { cause: 'Failed to authenticate.', details: 'DB error' }
      })

      Object.defineProperty(global, 'console', { value: originalConsole })
    })
  })

  describe('updateUser', () => {
    test('Should update user with status 200.', async () => {
      ;(jose.jwtVerify as Mock).mockResolvedValue({ payload: { userId: mockUser.id } })
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValue(mockUser)
      ;(BudgetDataSource.manager.save as Mock).mockResolvedValue(mockUser)

      const response = await request(app)
        .put('/api/user/update-user')
        .set('Authorization', 'Bearer token')
        .send({ email: mockUser.email, password: mockUser.password })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        message: 'User was updated.',
        code: ResCodes.UPDATE_USER,
        payload: { user: { ...mockUser, token: null, password: undefined } }
      })
    })

    test('Should update user with status 200, because of send only email.', async () => {
      ;(jose.jwtVerify as Mock).mockResolvedValue({ payload: { userId: mockUser.id } })
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValue(mockUser)
      ;(BudgetDataSource.manager.save as Mock).mockResolvedValue(mockUser)

      const response = await request(app).put('/api/user/update-user').set('Authorization', 'Bearer token').send({ email: mockUser.email })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        message: 'User was updated.',
        code: ResCodes.UPDATE_USER,
        payload: { user: { ...mockUser, token: null, password: undefined } }
      })
    })

    test('Should return validation error with status 422, because of email and password does not exist.', async () => {
      ;(jose.jwtVerify as Mock).mockResolvedValue({ payload: { userId: mockUser.id } })
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValue(mockUser)
      ;(BudgetDataSource.manager.save as Mock).mockResolvedValue(mockUser)

      const response = await request(app)
        .put('/api/user/update-user')
        .set('Authorization', 'Bearer token')
        .send({ email: '', password: '' })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        message: 'Update user validation failed.',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [
          {
            msg: 'At least one of the fields is required: email, password',
            type: 'alternative_grouped',
            nestedErrors: [
              [
                {
                  location: 'body',
                  msg: 'Invalid value',
                  path: 'email',
                  type: 'field',
                  value: ''
                }
              ],
              [
                {
                  location: 'body',
                  msg: 'Invalid value',
                  path: 'password',
                  type: 'field',
                  value: ''
                }
              ]
            ]
          }
        ]
      })
    })

    test('Should return validation error with status 422, because of invalid email.', async () => {
      ;(jose.jwtVerify as Mock).mockResolvedValue({ payload: { userId: mockUser.id } })
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValue(mockUser)
      ;(BudgetDataSource.manager.save as Mock).mockResolvedValue(mockUser)

      const response = await request(app).put('/api/user/update-user').set('Authorization', 'Bearer token').send({ email: 'invalid' })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        message: 'Update user validation failed.',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [
          {
            location: 'body',
            msg: 'Invalid value',
            path: 'email',
            type: 'field',
            value: '@invalid'
          }
        ]
      })
    })

    test('Should return validation error with status 422, because of invalid password.', async () => {
      ;(jose.jwtVerify as Mock).mockResolvedValue({ payload: { userId: mockUser.id } })
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValue(mockUser)
      ;(BudgetDataSource.manager.save as Mock).mockResolvedValue(mockUser)

      const response = await request(app).put('/api/user/update-user').set('Authorization', 'Bearer token').send({ password: 'invalid' })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        message: 'Update user validation failed.',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [
          {
            location: 'body',
            msg: 'Invalid value',
            path: 'password',
            type: 'field',
            value: 'invalid'
          }
        ]
      })
    })

    test('Should return validation error with status 422, because of send two params but one is invalid.', async () => {
      ;(jose.jwtVerify as Mock).mockResolvedValue({ payload: { userId: mockUser.id } })
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValue(mockUser)
      ;(BudgetDataSource.manager.save as Mock).mockResolvedValue(mockUser)

      const response = await request(app)
        .put('/api/user/update-user')
        .set('Authorization', 'Bearer token')
        .send({ email: 'invalid', password: mockUser.password })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        message: 'Update user validation failed.',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [
          {
            location: 'body',
            msg: 'Invalid value',
            path: 'email',
            type: 'field',
            value: '@invalid'
          }
        ]
      })
    })

    test('Should return error with status 500, because of DB error.', async () => {
      const mockConsole = { error: vi.fn() }
      Object.defineProperty(global, 'console', { value: mockConsole })
      ;(jose.jwtVerify as Mock).mockResolvedValue({ payload: { userId: mockUser.id } })
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValue(mockUser)
      ;(BudgetDataSource.manager.save as Mock).mockRejectedValue(new Error('DB error'))

      const response = await request(app)
        .put('/api/user/update-user')
        .set('Authorization', 'Bearer token')
        .send({ email: mockUser.email, password: mockUser.password })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: { cause: 'Failed to update user.', details: 'DB error' }
      })

      Object.defineProperty(global, 'console', { value: originalConsole })
    })
  })

  describe('deleteUser', () => {
    test('Should delete user with status 200.', async () => {
      ;(jose.jwtVerify as Mock).mockResolvedValue({ payload: { userId: mockUser.id } })
      ;(bcrypt.compare as Mock).mockResolvedValue(true)
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValue(mockUser)
      ;(BudgetDataSource.manager.delete as Mock).mockResolvedValue({ affected: 1 })
      const response = await request(app)
        .patch('/api/user/delete-user')
        .set('Authorization', 'Bearer token')
        .send({ password: mockUser.password })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        message: 'User was deleted.',
        code: ResCodes.DELETE_USER
      })
    })

    test('Should return validation error with status 422, because of invalid password.', async () => {
      const response = await request(app).patch('/api/user/delete-user').set('Authorization', 'Bearer token').send({ password: '' })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        message: 'Delete user validation failed.',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [
          {
            location: 'body',
            msg: 'Invalid value',
            path: 'password',
            type: 'field',
            value: ''
          }
        ]
      })
    })

    test('Should return error with status 401, because of wrong password.', async () => {
      const mockConsole = { error: vi.fn() }
      Object.defineProperty(global, 'console', { value: mockConsole })
      ;(jose.jwtVerify as Mock).mockResolvedValue({ payload: { userId: mockUser.id } })
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValue(mockUser)
      ;(bcrypt.compare as Mock).mockResolvedValue(false)
      const response = await request(app)
        .patch('/api/user/delete-user')
        .set('Authorization', 'Bearer token')
        .send({ password: mockUser.password })

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: { cause: 'Failed to delete user. Wrong password', details: '' }
      })
    })

    test('Should return 500 error, because of no user to delete.', async () => {
      ;(jose.jwtVerify as Mock).mockResolvedValue({ payload: { userId: mockUser.id } })
      ;(bcrypt.compare as Mock).mockResolvedValue(true)
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValue(mockUser)
      ;(BudgetDataSource.manager.delete as Mock).mockResolvedValue({ affected: 0 })
      const response = await request(app)
        .patch('/api/user/delete-user')
        .set('Authorization', 'Bearer token')
        .send({ password: mockUser.password })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: { cause: 'Failed to delete user. No one user was deleted.', details: '' }
      })
    })

    test('Should return error with status 500, because of DB error.', async () => {
      ;(jose.jwtVerify as Mock).mockResolvedValue({ payload: { userId: mockUser.id } })
      ;(bcrypt.compare as Mock).mockResolvedValue(true)
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValue(mockUser)
      ;(BudgetDataSource.manager.delete as Mock).mockRejectedValue(new Error('DB error'))
      const response = await request(app)
        .patch('/api/user/delete-user')
        .set('Authorization', 'Bearer token')
        .send({ password: mockUser.password })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: { cause: 'Failed to delete user.', details: 'DB error' }
      })

      Object.defineProperty(global, 'console', { value: originalConsole })
    })
  })
})
