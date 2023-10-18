import request from 'supertest'
import app from '../index'
import { ResCodes } from '../types/enums/index'
import { BudgetDataSource } from '../db/data-source'
import { Mock } from 'vitest'
import bcrypt from 'bcryptjs'

describe('userAPI', () => {
  const newUser = { id: 2, email: 'user@email.com', token: 'token', password: 'Zaq12wsx' }

  beforeAll(() => {
    vi.mock('typeorm', async () => {
      const actual = await vi.importActual('typeorm')

      const DataSource = vi.fn()
      DataSource.prototype.manager = {
        findOneBy: vi.fn(),
        findOne: vi.fn(),
        save: vi.fn()
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
  })

  afterAll(() => {
    vi.clearAllMocks()
  })

  describe('signup', () => {
    test('Should create and return new user with status 201.', async () => {
      ;(BudgetDataSource.manager.findOneBy as Mock).mockResolvedValue(null)
      ;(BudgetDataSource.manager.save as Mock).mockResolvedValue(newUser)
      const response = await request(app).post('/api/user/signup').send({ email: newUser.email, password: newUser.password })

      expect(response.status).toBe(201)
      expect(response.body).toEqual({
        message: 'Create new user.',
        code: ResCodes.CREATE_USER,
        payload: { user: { ...newUser, token: expect.any(String), password: undefined } }
      })
    })

    test('Should return validation error with status 422, because of invalid email.', async () => {
      const response = await request(app).post('/api/user/signup').send({ email: 'invalid', password: newUser.password })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        message: 'SignUp validation failed.',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [{ location: 'body', msg: 'Invalid value', path: 'email', type: 'field', value: '@invalid' }]
      })
    })

    test('Should return validation error with status 422, because of invalid password.', async () => {
      const response = await request(app).post('/api/user/signup').send({ email: newUser.email, password: 'invalid' })

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
      ;(BudgetDataSource.manager.findOneBy as Mock).mockResolvedValue(newUser)
      const response = await request(app).post('/api/user/signup').send({ email: newUser.email, password: newUser.password })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        message: 'SignUp validation failed.',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [{ location: 'body', msg: 'E-mail address already exists!', path: 'email', type: 'field', value: newUser.email }]
      })
    })

    test('Should return error with status 500, because of DB error.', async () => {
      const originalConsole = console
      const mockConsole = { error: vi.fn() }
      Object.defineProperty(global, 'console', { value: mockConsole })
      ;(BudgetDataSource.manager.findOneBy as Mock).mockResolvedValue(null)
      ;(BudgetDataSource.manager.save as Mock).mockRejectedValue(new Error('DB error'))
      const response = await request(app).post('/api/user/signup').send({ email: newUser.email, password: newUser.password })

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
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValue(newUser)
      ;(bcrypt.compare as Mock).mockResolvedValue(true)

      const response = await request(app).post('/api/user/login').send({ email: newUser.email, password: newUser.password })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        message: 'Login success.',
        code: ResCodes.LOGIN,
        payload: { user: { ...newUser, token: expect.any(String), password: undefined } }
      })
    })

    test('Should return validation error with status 422, because of invalid email.', async () => {
      const response = await request(app).post('/api/user/login').send({ password: newUser.password })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        message: 'Login validation failed.',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [{ location: 'body', msg: 'Invalid value', path: 'email', type: 'field', value: '' }]
      })
    })

    test('Should return validation error with status 422, because of invalid password.', async () => {
      const response = await request(app).post('/api/user/login').send({ email: newUser.email })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        message: 'Login validation failed.',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [{ location: 'body', msg: 'Invalid value', path: 'password', type: 'field', value: '' }]
      })
    })

    test('Should return error with status 401, because of invalid email.', async () => {
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValue(null)
      const response = await request(app).post('/api/user/login').send({ email: 'no-user@email.com', password: newUser.password })

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: { cause: 'Failed to login. User not found.', details: '' }
      })
    })

    test('Should return error with status 401, because of invalid password.', async () => {
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValue(newUser)
      ;(bcrypt.compare as Mock).mockResolvedValue(false)

      const response = await request(app).post('/api/user/login').send({ email: newUser.email, password: 'invalid' })

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: { cause: 'Failed to login. Wrong password.', details: '' }
      })
    })

    test('Should return error with status 500, because of DB error.', async () => {
      const originalConsole = console
      const mockConsole = { error: vi.fn() }
      Object.defineProperty(global, 'console', { value: mockConsole })
      ;(BudgetDataSource.manager.findOne as Mock).mockRejectedValue(new Error('DB error'))
      const response = await request(app).post('/api/user/login').send({ email: newUser.email, password: newUser.password })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: { cause: 'Failed to login.', details: 'DB error' }
      })

      Object.defineProperty(global, 'console', { value: originalConsole })
    })
  })
})
