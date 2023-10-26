import request from 'supertest'
import app from '../index'
import { ResCodes } from '../types/enums/index'
import { BudgetDataSource } from '../db/data-source'
import { Mock, describe, beforeAll, vi, test, afterAll, afterEach, expect, beforeEach } from 'vitest'
import * as jose from 'jose'
import { CategoryType } from '../types/enums'

describe('CategoriesAPI', () => {
  const originalConsole = console
  const mockUser = { id: 2, email: 'user@email.com', token: 'token', password: 'Zaq12wsx' }
  const mockCategory = { id: 1, name: 'car', type: CategoryType.EXPENSE }
  const mockedCategories = [mockCategory, (mockCategory.id = 2), (mockCategory.id = 3)]

  beforeAll(() => {
    vi.mock('typeorm', async () => {
      const actual = await vi.importActual('typeorm')

      const DataSource = vi.fn()
      DataSource.prototype.manager = {
        findOneBy: vi.fn(),
        findOne: vi.fn(),
        find: vi.fn(),
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

  beforeEach(() => {
    ;(jose.jwtVerify as Mock).mockResolvedValue({ payload: { userId: mockUser.id } })
    ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValueOnce(mockUser).mockResolvedValueOnce(null)
  })

  afterEach(() => {
    ;(BudgetDataSource.manager.findOne as Mock).mockReset()
  })

  describe('addCategory', () => {
    test('Should create new category with status 201', async () => {
      ;(BudgetDataSource.manager.save as Mock).mockResolvedValue(mockCategory)
      ;(BudgetDataSource.manager.find as Mock).mockResolvedValueOnce(mockedCategories)

      const response = await request(app)
        .post('/api/categories/add-category')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .send({ name: mockCategory.name, categoryType: mockCategory.type })

      expect(response.body).toEqual({
        message: 'Create new category.',
        code: ResCodes.CREATE_CATEGORY,
        payload: { categories: mockedCategories }
      })
    })

    test('Should return validation error with status 422, because of name is empty.', async () => {
      const response = await request(app)
        .post('/api/categories/add-category')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .send({ name: '', categoryType: mockCategory.type })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        message: 'Add Category validation failed.',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [{ location: 'body', msg: 'Invalid value', path: 'name', type: 'field', value: '' }]
      })
    })

    test('Should return validation error with status 422, because of category already exist for this user.', async () => {
      ;(BudgetDataSource.manager.findOne as Mock).mockReset()
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValueOnce(mockUser).mockResolvedValueOnce(mockCategory)

      const response = await request(app)
        .post('/api/categories/add-category')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .send({ name: mockCategory.name, categoryType: mockCategory.type })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        message: 'Add Category validation failed.',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [
          { location: 'body', msg: 'Category with this name already exists!', path: 'name', type: 'field', value: mockCategory.name }
        ]
      })
    })

    test('Should return validation error with status 422, because of categoryType is invalid.', async () => {
      const response = await request(app)
        .post('/api/categories/add-category')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .send({ name: mockCategory.name, categoryType: 'invalid' })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        message: 'Add Category validation failed.',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [
          { location: 'body', msg: 'Invalid categoryType', path: 'name', type: 'field', value: 'car' },
          { location: 'body', msg: 'Invalid categoryType', path: 'categoryType', type: 'field', value: 'invalid' }
        ]
      })
    })

    test('Should return error with status 500, because of Failed to create new category.', async () => {
      ;(BudgetDataSource.manager.save as Mock).mockResolvedValue(null)

      const response = await request(app)
        .post('/api/categories/add-category')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .send({ name: mockCategory.name, categoryType: mockCategory.type })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: {
          cause: 'Failed to create new category.',
          details: ''
        }
      })
    })

    test('Should return error with status 500, DB error.', async () => {
      const err = new Error('DB error')
      ;(BudgetDataSource.manager.save as Mock).mockResolvedValue(mockCategory)
      ;(BudgetDataSource.manager.find as Mock).mockRejectedValue(err)

      const response = await request(app)
        .post('/api/categories/add-category')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .send({ name: mockCategory.name, categoryType: mockCategory.type })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: {
          cause: 'Failed to create new category.',
          details: err.message
        }
      })
    })
  })

  describe('getCategories', () => {
    test('Should return categories with status 200', async () => {
      ;(BudgetDataSource.manager.find as Mock).mockResolvedValueOnce(mockedCategories)

      const response = await request(app).get('/api/categories/get-categories').set('Authorization', `Bearer ${mockUser.token}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        message: 'Category list successfully provided.',
        code: ResCodes.GET_CATEGORIES,
        payload: { categories: mockedCategories }
      })
    })

    test('Should return error with status 500, DB error.', async () => {
      const err = new Error('DB error')
      ;(BudgetDataSource.manager.find as Mock).mockRejectedValue(err)

      const response = await request(app).get('/api/categories/get-categories').set('Authorization', `Bearer ${mockUser.token}`)

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: {
          cause: 'Failed to get categories.',
          details: err.message
        }
      })
    })
  })

  describe('deleteCategory', () => {
    test('Should delete category with status 200', async () => {
      ;(BudgetDataSource.manager.delete as Mock).mockResolvedValueOnce({ affected: 1 })
      ;(BudgetDataSource.manager.find as Mock).mockResolvedValueOnce(mockedCategories)

      const response = await request(app)
        .delete('/api/categories/delete-category')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .query({ id: mockCategory.id })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        message: 'Category was deleted successfully.',
        code: ResCodes.DELETE_CATEGORY,
        payload: { categories: mockedCategories }
      })
    })

    test('Should return error with status 400, because of Failed to delete category. Invalid query param category id.', async () => {
      const response = await request(app)
        .delete('/api/categories/delete-category')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .query({})

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: {
          cause: 'Failed to delete category. Invalid query param category id.',
          details: ''
        }
      })
    })

    test('Should return error with status 500, because of Failed to delete category. No one category was deleted.', async () => {
      ;(BudgetDataSource.manager.delete as Mock).mockResolvedValueOnce({ affected: 0 })

      const response = await request(app)
        .delete('/api/categories/delete-category')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .query({ id: mockCategory.id })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: {
          cause: 'Failed to delete category. No one category was deleted.',
          details: ''
        }
      })
    })

    test('Should return error with status 500, DB error.', async () => {
      const err = new Error('DB error')
      ;(BudgetDataSource.manager.delete as Mock).mockResolvedValueOnce({ affected: 1 })
      ;(BudgetDataSource.manager.find as Mock).mockRejectedValue(err)

      const response = await request(app)
        .delete('/api/categories/delete-category')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .query({ id: mockCategory.id })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: {
          cause: 'Failed to delete category.',
          details: err.message
        }
      })
    })
  })

  describe('updateCategory', () => {
    test('Should update category with status 200', async () => {
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValueOnce(mockCategory)
      ;(BudgetDataSource.manager.save as Mock).mockResolvedValueOnce(mockCategory)
      ;(BudgetDataSource.manager.find as Mock).mockResolvedValueOnce(mockedCategories)

      const response = await request(app)
        .put('/api/categories/update-category')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .send({ id: mockCategory.id, name: mockCategory.name, categoryType: mockCategory.type })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        message: 'Category was updated successfully.',
        code: ResCodes.UPDATE_CATEGORY,
        payload: { categories: mockedCategories }
      })
    })

    test('Should return validation error with status 422, because of name is empty.', async () => {
      const response = await request(app)
        .put('/api/categories/update-category')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .send({ id: mockCategory.id, name: '', categoryType: mockCategory.type })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        message: 'Update category validation failed.',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [{ location: 'body', msg: 'Invalid value', path: 'name', type: 'field', value: '' }]
      })
    })

    test('Should return validation error with status 422, because of id is empty.', async () => {
      const response = await request(app)
        .put('/api/categories/update-category')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .send({ id: '', name: mockCategory.name, categoryType: mockCategory.type })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        message: 'Update category validation failed.',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [{ location: 'body', msg: 'Invalid value', path: 'id', type: 'field', value: '' }]
      })
    })

    test('Should return validation error with status 422, because of category already exist for this user.', async () => {
      ;(BudgetDataSource.manager.findOne as Mock).mockReset()
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValueOnce(mockUser).mockResolvedValueOnce(mockCategory)

      const response = await request(app)
        .put('/api/categories/update-category')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .send({ id: mockCategory.id, name: mockCategory.name, categoryType: mockCategory.type })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        message: 'Update category validation failed.',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [
          { location: 'body', msg: 'Category with this name already exists!', path: 'name', type: 'field', value: mockCategory.name }
        ]
      })
    })

    test('Should return validation error with status 422, because of categoryType is invalid.', async () => {
      const response = await request(app)
        .put('/api/categories/update-category')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .send({ id: mockCategory.id, name: mockCategory.name, categoryType: 'invalid' })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        message: 'Update category validation failed.',
        code: ResCodes.VALIDATION_ERROR,
        validationErrors: [
          { location: 'body', msg: 'Invalid categoryType', path: 'name', type: 'field', value: 'car' },
          { location: 'body', msg: 'Invalid categoryType', path: 'categoryType', type: 'field', value: 'invalid' }
        ]
      })
    })

    test('Should return error with status 400, because of Failed to update category. Category with this id does not exist.', async () => {
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValueOnce(null)

      const response = await request(app)
        .put('/api/categories/update-category')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .send({ id: mockCategory.id, name: mockCategory.name, categoryType: mockCategory.type })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: {
          cause: 'Failed to update category. Category with this id does not exist.',
          details: ''
        }
      })
    })

    test('Should return error with status 500, because of Failed to update category.', async () => {
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValueOnce(mockCategory)
      ;(BudgetDataSource.manager.save as Mock).mockResolvedValueOnce(null)

      const response = await request(app)
        .put('/api/categories/update-category')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .send({ id: mockCategory.id, name: mockCategory.name, categoryType: mockCategory.type })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: {
          cause: 'Failed to update category.',
          details: ''
        }
      })
    })

    test('Should return error with status 500, DB error.', async () => {
      const err = new Error('DB error')
      ;(BudgetDataSource.manager.findOne as Mock).mockResolvedValueOnce(mockCategory)
      ;(BudgetDataSource.manager.save as Mock).mockRejectedValue(err)

      const response = await request(app)
        .put('/api/categories/update-category')
        .set('Authorization', `Bearer ${mockUser.token}`)
        .send({ id: mockCategory.id, name: mockCategory.name, categoryType: mockCategory.type })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        message: 'Internal server error',
        code: ResCodes.ERROR,
        error: {
          cause: 'Failed to update category.',
          details: err.message
        }
      })
    })
  })
})
