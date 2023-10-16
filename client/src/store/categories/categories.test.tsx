import store from '..'
import { categoriesActions } from './categories-slice'
import { mockedCategories } from '../../utils/test-utils'
import { CategoryType } from '../../types/enum'
import { addCategory, getCategories, deleteCategory, updateCategory } from './categories-actions'
import { setupServer } from 'msw/node'
import { handlers } from '../../utils/test-utils'
import { isActionPayload } from '../../types/store-actions'
import axios from 'axios'

describe('Categories Store', () => {
  describe('reducers', () => {
    afterEach(() => {
      store.dispatch(categoriesActions.setCategories([]))
    })

    test('Should set categories.', () => {
      store.dispatch(categoriesActions.setCategories(mockedCategories))

      expect(store.getState().categories.categories).toEqual(mockedCategories)
    })

    test('Should add one category.', () => {
      const category = mockedCategories[0]
      store.dispatch(categoriesActions.addCategory(category))

      expect(store.getState().categories.categories).toEqual([category])
    })
  })

  describe('actions', () => {
    const dispatch = store.dispatch
    const server = setupServer(...handlers)

    afterEach(() => {
      server.resetHandlers()
      store.dispatch(categoriesActions.setCategories([]))
    })

    beforeAll(() => {
      server.listen()
    })

    afterAll(() => {
      server.close()
    })

    test('Should add category.', async () => {
      const category = mockedCategories[0]
      const res = await dispatch(addCategory({ token: 'token', name: category.name, categoryType: category.categoryType }))

      expect(isActionPayload(res)).toBeTruthy()
      expect(store.getState().categories.categories).toEqual([category])
    })

    test('Should return axios error on add category.', async () => {
      jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error('test error'))

      const res = await dispatch(addCategory({ token: 'token', name: 'test', categoryType: CategoryType.EXPENSE }))

      expect(res).toEqual({
        error: new Error('test error')
      })

      jest.spyOn(axios, 'post').mockRestore()
    })

    test('Should get categories.', async () => {
      const res = await dispatch(getCategories({ token: 'token' }))

      expect(isActionPayload(res)).toBeTruthy()
      expect(store.getState().categories.categories).toEqual(mockedCategories)
    })

    test('Should return axios error on get categories.', async () => {
      jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('test error'))

      const res = await dispatch(getCategories({ token: 'token' }))

      expect(res).toEqual({
        error: new Error('test error')
      })

      jest.spyOn(axios, 'get').mockRestore()
    })

    test('Should delete category.', async () => {
      const res = await dispatch(deleteCategory({ token: 'token', id: 1 }))

      expect(isActionPayload(res)).toBeTruthy()
      expect(store.getState().categories.categories[0].id).toEqual('1')
    })

    test('Should return axios error on delete category.', async () => {
      jest.spyOn(axios, 'delete').mockRejectedValueOnce(new Error('test error'))

      const res = await dispatch(deleteCategory({ token: 'token', id: 1 }))

      expect(res).toEqual({
        error: new Error('test error')
      })

      jest.spyOn(axios, 'delete').mockRestore()
    })

    test('Should update category.', async () => {
      const res = await dispatch(updateCategory({ token: 'token', id: 1, name: 'test', categoryType: CategoryType.EXPENSE }))

      expect(isActionPayload(res)).toBeTruthy()
      expect(store.getState().categories.categories[0].name).toEqual('test')
    })

    test('Should return axios error on update category.', async () => {
      jest.spyOn(axios, 'put').mockRejectedValueOnce(new Error('test error'))

      const res = await dispatch(updateCategory({ token: 'token', id: 1, name: 'test', categoryType: CategoryType.EXPENSE }))

      expect(res).toEqual({
        error: new Error('test error')
      })

      jest.spyOn(axios, 'put').mockRestore()
    })
  })
})
