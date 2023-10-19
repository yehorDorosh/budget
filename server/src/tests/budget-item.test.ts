import request from 'supertest'
import app from '../index'
import { CategoryType, ResCodes } from '../types/enums/index'
import { BudgetDataSource } from '../db/data-source'
import { Mock } from 'vitest'
// import bcrypt from 'bcryptjs'
import * as jose from 'jose'

describe('BudgetItemAPI', () => {
  const originalConsole = console
  const mockUser = { id: 2, email: 'user@email.com', token: 'token', password: 'Zaq12wsx' }
  const mockCategory = { id: 1, name: 'car', type: CategoryType.EXPENSE }
  const mockBudgetItem = { id: 1, name: 'fuel', value: 100, userDate: new Date().toString(), ignore: false, category: mockCategory }
  const mockBudgetItems = [mockBudgetItem, (mockBudgetItem.id = 2), (mockBudgetItem.id = 3)]

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

      DataSource.prototype.getRepository = vi.fn().mockReturnValue({
        createQueryBuilder: vi.fn().mockReturnValue({
          leftJoin: vi.fn().mockReturnThis(),
          addSelect: vi.fn().mockReturnThis(),
          where: vi.fn().mockReturnThis(),
          andWhere: vi.fn().mockReturnThis(),
          orderBy: vi.fn().mockReturnThis(),
          addOrderBy: vi.fn().mockReturnThis(),
          getMany: vi.fn()
        })
      })

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

    vi.mock('jose', async () => {
      const actual = await vi.importActual('jose')

      return {
        ...(actual as object),
        jwtVerify: vi.fn()
      }
    })

    console.error = vi.fn()
  })

  afterAll(() => {
    vi.clearAllMocks()
    Object.defineProperty(global, 'console', { value: originalConsole })
  })

  describe('addBudgetItem', () => {
    test('Should create new one budget item with status 201', async () => {
      ;(jose.jwtVerify as Mock).mockResolvedValue({ payload: { userId: mockUser.id } })
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValueOnce(mockUser).mockResolvedValueOnce(mockCategory)
      ;(BudgetDataSource.manager.save as Mock).mockResolvedValue(mockBudgetItem)
      ;(BudgetDataSource.getRepository('').createQueryBuilder().getMany as Mock).mockResolvedValue(mockBudgetItems)

      const response = await request(app).post('/api/budget/add-budget-item').set('Authorization', `Bearer ${mockUser.token}`).send({
        categoryId: mockCategory.id,
        name: mockBudgetItem.name,
        value: mockBudgetItem.value,
        userDate: mockBudgetItem.userDate
      })

      expect(response.status).toBe(201)
      expect(response.body).toEqual({
        message: 'Create new budget item.',
        code: ResCodes.CREATE_BUDGET_ITEM,
        payload: { budgetItems: mockBudgetItems }
      })
    })

    test('Should return validation error with status 422, because of empty name', async () => {
      ;(jose.jwtVerify as Mock).mockResolvedValue({ payload: { userId: mockUser.id } })
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValueOnce(mockUser)

      const response = await request(app).post('/api/budget/add-budget-item').set('Authorization', `Bearer ${mockUser.token}`).send({
        categoryId: mockCategory.id,
        name: '',
        value: mockBudgetItem.value,
        userDate: mockBudgetItem.userDate
      })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        message: 'Add budget item validation failed.',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [{ location: 'body', msg: 'Invalid value', path: 'name', type: 'field', value: '' }]
      })
    })

    test('Should return validation error with status 422, because of empty value', async () => {
      ;(jose.jwtVerify as Mock).mockResolvedValue({ payload: { userId: mockUser.id } })
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValueOnce(mockUser)

      const response = await request(app).post('/api/budget/add-budget-item').set('Authorization', `Bearer ${mockUser.token}`).send({
        categoryId: mockCategory.id,
        name: mockBudgetItem.name,
        value: '',
        userDate: mockBudgetItem.userDate
      })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        message: 'Add budget item validation failed.',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [{ location: 'body', msg: 'Invalid value', path: 'value', type: 'field', value: '' }]
      })
    })

    test('Should return validation error with status 422, because of empty userDate', async () => {
      ;(jose.jwtVerify as Mock).mockResolvedValue({ payload: { userId: mockUser.id } })
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValueOnce(mockUser)

      const response = await request(app).post('/api/budget/add-budget-item').set('Authorization', `Bearer ${mockUser.token}`).send({
        categoryId: mockCategory.id,
        name: mockBudgetItem.name,
        value: mockBudgetItem.value,
        userDate: ''
      })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        message: 'Add budget item validation failed.',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [{ location: 'body', msg: 'Invalid value', path: 'userDate', type: 'field', value: '' }]
      })
    })

    test('Should return validation error with status 422, because of empty categoryId', async () => {
      ;(jose.jwtVerify as Mock).mockResolvedValue({ payload: { userId: mockUser.id } })
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValueOnce(mockUser)

      const response = await request(app).post('/api/budget/add-budget-item').set('Authorization', `Bearer ${mockUser.token}`).send({
        categoryId: '',
        name: mockBudgetItem.name,
        value: mockBudgetItem.value,
        userDate: mockBudgetItem.userDate
      })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        message: 'Add budget item validation failed.',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [{ location: 'body', msg: 'Invalid value', path: 'categoryId', type: 'field', value: '' }]
      })
    })

    test('Should return validation error with status 422, because of all fields is empty.', async () => {
      ;(jose.jwtVerify as Mock).mockResolvedValue({ payload: { userId: mockUser.id } })
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValueOnce(mockUser)

      const response = await request(app).post('/api/budget/add-budget-item').set('Authorization', `Bearer ${mockUser.token}`).send({
        categoryId: '',
        name: '',
        value: '',
        userDate: ''
      })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        message: 'Add budget item validation failed.',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [
          { location: 'body', msg: 'Invalid value', path: 'name', type: 'field', value: '' },
          { location: 'body', msg: 'Invalid value', path: 'value', type: 'field', value: '' },
          { location: 'body', msg: 'Invalid value', path: 'userDate', type: 'field', value: '' },
          { location: 'body', msg: 'Invalid value', path: 'categoryId', type: 'field', value: '' }
        ]
      })
    })

    test('Should return error with status 500, because of category does not exist.', async () => {
      ;(jose.jwtVerify as Mock).mockResolvedValue({ payload: { userId: mockUser.id } })
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValueOnce(mockUser).mockResolvedValueOnce(null)

      const response = await request(app).post('/api/budget/add-budget-item').set('Authorization', `Bearer ${mockUser.token}`).send({
        categoryId: mockCategory.id,
        name: mockBudgetItem.name,
        value: mockBudgetItem.value,
        userDate: mockBudgetItem.userDate
      })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: {
          cause: 'Failed to create budget item. No category for this budget item.',
          details: ''
        }
      })
    })

    test('Should return error with status 500, because of budget item was not created', async () => {
      ;(jose.jwtVerify as Mock).mockResolvedValue({ payload: { userId: mockUser.id } })
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValueOnce(mockUser).mockResolvedValueOnce(mockCategory)
      ;(BudgetDataSource.manager.save as Mock).mockResolvedValue(null)

      const response = await request(app).post('/api/budget/add-budget-item').set('Authorization', `Bearer ${mockUser.token}`).send({
        categoryId: mockCategory.id,
        name: mockBudgetItem.name,
        value: mockBudgetItem.value,
        userDate: mockBudgetItem.userDate
      })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: {
          cause: 'Failed to create budget item.',
          details: ''
        }
      })
    })

    test('Should return error with status 500, because of DB error.', async () => {
      ;(jose.jwtVerify as Mock).mockResolvedValue({ payload: { userId: mockUser.id } })
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValueOnce(mockUser).mockResolvedValueOnce(mockCategory)
      ;(BudgetDataSource.manager.save as Mock).mockResolvedValue(mockBudgetItem)
      ;(BudgetDataSource.getRepository('').createQueryBuilder().getMany as Mock).mockRejectedValue(new Error('DB error'))

      const response = await request(app).post('/api/budget/add-budget-item').set('Authorization', `Bearer ${mockUser.token}`).send({
        categoryId: mockCategory.id,
        name: mockBudgetItem.name,
        value: mockBudgetItem.value,
        userDate: mockBudgetItem.userDate
      })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: {
          cause: 'Failed to create budget item.',
          details: 'DB error'
        }
      })
    })
  })
})
