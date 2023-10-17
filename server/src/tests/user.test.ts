import request from 'supertest'
import app from '../index'
import { ResCodes } from '../types/enums/index'
import { BudgetDataSource } from '../db/data-source'
import { Mock } from 'vitest'

describe('userAPI', () => {
  const newUser = { id: 2, email: 'user@email.com', token: 'token', password: 'Zaq12wsx' }

  beforeAll(() => {
    vi.mock('typeorm', async () => {
      const actual = await vi.importActual('typeorm')

      const DataSource = vi.fn()
      DataSource.prototype.manager = {
        findOneBy: vi.fn(),
        save: vi.fn()
      }
      DataSource.prototype.initialize = vi.fn()

      return { ...(actual as object), DataSource }
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
      const originalConsoleError = console.error
      vi.stubGlobal('console', { error: vi.fn() })
      ;(BudgetDataSource.manager.findOneBy as Mock).mockResolvedValue(null)
      ;(BudgetDataSource.manager.save as Mock).mockRejectedValue(new Error('DB error'))
      const response = await request(app).post('/api/user/signup').send({ email: newUser.email, password: newUser.password })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: { cause: 'Failed to create new user.', details: 'DB error' }
      })

      console.error = originalConsoleError
    })
  })
})
