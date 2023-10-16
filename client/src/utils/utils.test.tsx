import { emailValidator, passwordValidator, notEmptyValidator, shouldMatchValidator } from './validators'
import objectToQueryString from './query'
import { errorHandler } from './errors'
import axios from 'axios'
import { isRegularErrorObject } from '../types/store-actions'
import { getCurrentYearMonth, formatDateYearMonth, isDateValid, formatDateYearMonthDay } from './date'

describe('utils functions tests', () => {
  describe('validators', () => {
    test('emailValidator', () => {
      expect(emailValidator('')).toBe(false)
      expect(emailValidator('test')).toBe(false)
      expect(emailValidator('test@test')).toBe(false)
      expect(emailValidator('test@test.c')).toBe(false)
      expect(emailValidator('test@test.com')).toBe(true)
    })

    test('passwordValidator', () => {
      expect(passwordValidator('')).toBe(false)
      expect(passwordValidator('test')).toBe(false)
      expect(passwordValidator('testtest')).toBe(false)
      expect(passwordValidator('testtest1')).toBe(false)
      expect(passwordValidator('Test1')).toBe(false)
      expect(passwordValidator('tesTtes1')).toBe(true)
    })

    test('notEmptyValidator', () => {
      expect(notEmptyValidator('')).toBe(false)
      expect(notEmptyValidator('test')).toBe(true)
    })

    test('shouldMatchValidator', () => {
      expect(shouldMatchValidator('test', 'test')).toBe(true)
      expect(shouldMatchValidator('test', 'test1')).toBe(false)
    })
  })

  describe('objectToQueryString', () => {
    test('Should return empty string if object is empty', () => {
      expect(objectToQueryString({})).toBe('')
    })

    test('Should return correct query string', () => {
      expect(objectToQueryString({ a: '1', b: '2' })).toBe('a=1&b=2')
    })
  })

  describe('errorHandler', () => {
    test('Should return specific obj if error is axios error', async () => {
      jest.spyOn(axios, 'get').mockRejectedValue(new Error('test'))
      let error: any

      try {
        await axios.get('')
      } catch (e) {
        error = e
        error.response = { data: { message: 'test' } }
      }

      expect(isRegularErrorObject(errorHandler(error))).toBe(true)
      jest.spyOn(axios, 'get').mockRestore()
    })

    test('Should return regular obj error if error is regular error', async () => {
      let error: any

      try {
        throw new Error('test')
      } catch (e) {
        error = e
      }

      expect(errorHandler(error)).toEqual({ error: new Error('test') })
    })
  })

  describe('Date format functions', () => {
    test('getCurrentYearMonth', () => {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1

      expect(getCurrentYearMonth()).toEqual(`${year}-${month}`)
    })

    test('formatDateYearMonth', () => {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1

      expect(formatDateYearMonth(date)).toEqual(`${year}-${month}`)
    })

    test('isDateValid', () => {
      expect(isDateValid('2021-01')).toBe(true)
      expect(isDateValid('')).toBe(false)
      expect(isDateValid('22')).toBe(false)
    })

    test('formatDateYearMonthDay', () => {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()

      expect(formatDateYearMonthDay(date)).toEqual(`${year}-${month}-${day}`)
    })
  })
})
