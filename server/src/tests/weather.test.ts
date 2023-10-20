import request from 'supertest'
import app from '../index'
import { ResCodes } from '../types/enums/index'
import { BudgetDataSource } from '../db/data-source'
import { Mock } from 'vitest'

describe('WeatherAPI', () => {
  const originalConsole = console
  const mockWeatherItem = {
    t: 20,
    p: 1000,
    v: 10,
    id: '1',
    db_id: 1
  }
  const mockWeatherItems = [mockWeatherItem, mockWeatherItem.db_id++, mockWeatherItem.db_id++]

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
          orWhere: vi.fn().mockReturnThis(),
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

  describe('saveWeatherData', () => {
    test('should return 201 and new weather data', async () => {
      ;(BudgetDataSource.manager.save as Mock).mockResolvedValue(mockWeatherItems)

      const response = await request(app).post('/api/weather').send(mockWeatherItem)

      expect(response.status).toBe(201)
      expect(response.body).toEqual({
        message: 'New weather data created successfully.',
        payload: { weather: mockWeatherItems }
      })
    })

    test('Should return validation error, because of missing id', async () => {
      const response = await request(app)
        .post('/api/weather')
        .send({ ...mockWeatherItem, id: undefined })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        code: ResCodes.VALIDATION_ERROR,
        message: 'Add weather item validation failed.',
        validationErrors: [
          {
            location: 'body',
            msg: 'Invalid value',
            path: 'id',
            type: 'field',
            value: ''
          }
        ]
      })
    })

    test('Should return validation error, because of missing t', async () => {
      const response = await request(app)
        .post('/api/weather')
        .send({ ...mockWeatherItem, t: undefined })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        code: ResCodes.VALIDATION_ERROR,
        message: 'Add weather item validation failed.',
        validationErrors: [
          {
            location: 'body',
            msg: 'Invalid value',
            path: 't',
            type: 'field',
            value: ''
          }
        ]
      })
    })

    test('Should return validation error, because of missing p', async () => {
      const response = await request(app)
        .post('/api/weather')
        .send({ ...mockWeatherItem, p: undefined })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        code: ResCodes.VALIDATION_ERROR,
        message: 'Add weather item validation failed.',
        validationErrors: [
          {
            location: 'body',
            msg: 'Invalid value',
            path: 'p',
            type: 'field',
            value: ''
          }
        ]
      })
    })

    test('Should return validation error, because of missing v', async () => {
      const response = await request(app)
        .post('/api/weather')
        .send({ ...mockWeatherItem, v: undefined })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        code: ResCodes.VALIDATION_ERROR,
        message: 'Add weather item validation failed.',
        validationErrors: [
          {
            location: 'body',
            msg: 'Invalid value',
            path: 'v',
            type: 'field',
            value: ''
          }
        ]
      })
    })

    test('Should return error with status 500, because of Failed to create weather item.', async () => {
      ;(BudgetDataSource.manager.save as Mock).mockResolvedValue(null)

      const response = await request(app).post('/api/weather').send(mockWeatherItem)

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        code: ResCodes.ERROR,
        message: 'Internal server error',
        error: {
          cause: 'Failed to create weather item.',
          details: ''
        }
      })
    })

    test('Should return error with status 500, because of DB error.', async () => {
      ;(BudgetDataSource.manager.save as Mock).mockRejectedValue('DB error')

      const response = await request(app).post('/api/weather').send(mockWeatherItem)

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        code: ResCodes.ERROR,
        message: 'Internal server error',
        error: {
          cause: 'Failed to create weather item.',
          details: 'DB error'
        }
      })
    })
  })

  describe('getLastWeatherData', () => {
    test('should return 200 and last weather data', async () => {
      ;(BudgetDataSource.getRepository('').createQueryBuilder().getMany as Mock).mockResolvedValue(mockWeatherItem)

      const response = await request(app).get('/api/weather/last-weather')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        message: 'Get last weather successfully.',
        payload: { weather: mockWeatherItem }
      })
    })

    test('Should return error with status 500, because of DB error.', async () => {
      ;(BudgetDataSource.getRepository('').createQueryBuilder().getMany as Mock).mockRejectedValue('DB error')

      const response = await request(app).get('/api/weather/last-weather')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        code: ResCodes.ERROR,
        message: 'Internal server error',
        error: {
          cause: 'Failed to get last weather.',
          details: 'DB error'
        }
      })
    })
  })
})
