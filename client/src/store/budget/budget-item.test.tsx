import store from '..'
import { budgetItemActions } from './budget-item-slice'
import { mockedBudgetItems } from '../../utils/test-utils'
import { CategoryType, QueryFilter } from '../../types/enum'
import { addBudgetItem, getBudgetItems, deleteBudgetItem, updateBudgetItem } from './budget-item-actions'
import { setupServer } from 'msw/node'
import { handlers } from '../../utils/test-utils'
import { isActionPayload } from '../../types/store-actions'
import axios from 'axios'
import { ReducerType } from '../../types/enum'

describe('BudgetItem Store', () => {
  describe('reducers', () => {
    afterEach(() => {
      store.dispatch(budgetItemActions.setBudgetItems([]))
      store.dispatch(budgetItemActions.setTrendBudgetItems([]))
      store.dispatch(budgetItemActions.setFilterMonth(''))
      store.dispatch(budgetItemActions.setFilterYear(''))
      store.dispatch(budgetItemActions.setActiveFilter(QueryFilter.MONTH))
      store.dispatch(budgetItemActions.setFilterName(''))
      store.dispatch(budgetItemActions.setFilterCategoryType(''))
      store.dispatch(budgetItemActions.setFilterCategory(''))
      store.dispatch(budgetItemActions.setFilterIgnore(false))
    })

    test('Should set budget items.', () => {
      store.dispatch(budgetItemActions.setBudgetItems(mockedBudgetItems))

      expect(store.getState().budgetItem.budgetItems).toEqual(mockedBudgetItems)
    })

    test('Should set trend budget items.', () => {
      store.dispatch(budgetItemActions.setTrendBudgetItems(mockedBudgetItems))

      expect(store.getState().budgetItem.trendBudgetItems).toEqual(mockedBudgetItems)
    })

    test('Should set filter month.', () => {
      const month = '2021-01'
      store.dispatch(budgetItemActions.setFilterMonth(month))

      expect(store.getState().budgetItem.filters.month).toEqual(month)
    })

    test('Should increment filter month.', () => {
      const month = '2021-01'
      store.dispatch(budgetItemActions.setFilterMonth(month))
      store.dispatch(budgetItemActions.increaseMonth())

      expect(store.getState().budgetItem.filters.month).toEqual('2021-02')
    })

    test('Should decrement filter month.', () => {
      const month = '2021-01'
      store.dispatch(budgetItemActions.setFilterMonth(month))
      store.dispatch(budgetItemActions.decreaseMonth())

      expect(store.getState().budgetItem.filters.month).toEqual('2020-12')
    })

    test('Don nothing if filter month is empty when incrementing.', () => {
      store.dispatch(budgetItemActions.increaseMonth())

      expect(store.getState().budgetItem.filters.month).toEqual('')
    })

    test('Should set filter year.', () => {
      const year = '2021'
      store.dispatch(budgetItemActions.setFilterYear(year))

      expect(store.getState().budgetItem.filters.year).toEqual(year)
    })

    test('Should increment filter year.', () => {
      const year = '2021'
      store.dispatch(budgetItemActions.setFilterYear(year))
      store.dispatch(budgetItemActions.increaseYear())

      expect(store.getState().budgetItem.filters.year).toEqual('2022')
    })

    test('Should decrement filter year.', () => {
      const year = '2021'
      store.dispatch(budgetItemActions.setFilterYear(year))
      store.dispatch(budgetItemActions.decreaseYear())

      expect(store.getState().budgetItem.filters.year).toEqual('2020')
    })

    test('Don nothing if filter year is empty when incrementing.', () => {
      store.dispatch(budgetItemActions.increaseYear())

      expect(store.getState().budgetItem.filters.year).toEqual('')
    })

    test('Should set active filter.', () => {
      const active = QueryFilter.ALL
      store.dispatch(budgetItemActions.setActiveFilter(active))

      expect(store.getState().budgetItem.filters.active).toEqual(active)
    })

    test('Should set filter by name.', () => {
      const name = 'test'
      store.dispatch(budgetItemActions.setFilterName(name))

      expect(store.getState().budgetItem.filters.name).toEqual(name)
    })

    test('Should set filter by category type.', () => {
      let categoryType: CategoryType | string = CategoryType.EXPENSE
      store.dispatch(budgetItemActions.setFilterCategoryType(categoryType))

      expect(store.getState().budgetItem.filters.categoryType).toEqual(categoryType)

      categoryType = ''
      store.dispatch(budgetItemActions.setFilterCategoryType(categoryType))

      expect(store.getState().budgetItem.filters.categoryType).toEqual(undefined)
    })

    test('Should set filter by category.', () => {
      const category = '1'
      store.dispatch(budgetItemActions.setFilterCategory(category))

      expect(store.getState().budgetItem.filters.category).toEqual(+category)
    })

    test('Should set filter by ignore.', () => {
      const ignore = true
      store.dispatch(budgetItemActions.setFilterIgnore(ignore))

      expect(store.getState().budgetItem.filters.ignore).toEqual(ignore)
    })
  })

  describe('actions', () => {
    const dispatch = store.dispatch
    const server = setupServer(...handlers)

    afterEach(() => {
      server.resetHandlers()
      store.dispatch(budgetItemActions.setBudgetItems([]))
      store.dispatch(budgetItemActions.setTrendBudgetItems([]))
      store.dispatch(budgetItemActions.setFilterMonth(''))
      store.dispatch(budgetItemActions.setFilterYear(''))
      store.dispatch(budgetItemActions.setActiveFilter(QueryFilter.MONTH))
      store.dispatch(budgetItemActions.setFilterName(''))
      store.dispatch(budgetItemActions.setFilterCategoryType(''))
      store.dispatch(budgetItemActions.setFilterCategory(''))
      store.dispatch(budgetItemActions.setFilterIgnore(false))
    })

    beforeAll(() => {
      server.listen()
    })

    afterAll(() => {
      server.close()
    })

    test('Should add budget item.', async () => {
      let payload: any
      const res = await dispatch(
        addBudgetItem({ token: 'token', categoryId: 21, name: 'test', value: 111, userDate: '2021-01-01', filters: {} })
      )

      if (isActionPayload(res)) {
        payload = res.data.payload
      }

      expect(store.getState().budgetItem.budgetItems.length).toEqual(6)
      expect(payload.budgetItems[0]).toEqual({
        id: 6,
        category: { categoryType: 'expense', id: 21, name: 'education' },
        name: 'test',
        value: 111,
        userDate: '2021-01-01',
        ignore: false
      })
    })

    test('Should get axios error when adding budget item.', async () => {
      jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error('test error'))

      const res = await dispatch(
        addBudgetItem({ token: 'token', categoryId: 21, name: 'test', value: 111, userDate: '2021-01-01', filters: {} })
      )

      expect(res).toEqual({
        error: new Error('test error')
      })

      jest.spyOn(axios, 'post').mockRestore()
    })

    test('Should get budget items.', async () => {
      const res = await store.dispatch(getBudgetItems({ token: 'token' }))

      expect(store.getState().budgetItem.budgetItems.length).toEqual(5)
      expect(store.getState().budgetItem.trendBudgetItems.length).toEqual(0)

      expect(res).toHaveProperty('data')
      expect(res).toHaveProperty('status')
    })

    test('Should get budget items for month trend.', async () => {
      await store.dispatch(getBudgetItems({ token: 'token' }, ReducerType.BudgetItemsTrend))

      expect(store.getState().budgetItem.budgetItems.length).toEqual(0)
      expect(store.getState().budgetItem.trendBudgetItems.length).toEqual(5)
    })

    test('Should get axios error when getting budget items.', async () => {
      jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('test error'))

      const res = await store.dispatch(getBudgetItems({ token: 'token' }))

      expect(res).toEqual({
        error: new Error('test error')
      })

      jest.spyOn(axios, 'get').mockRestore()
    })

    test('Should delete budget item.', async () => {
      const res = await store.dispatch(deleteBudgetItem({ token: 'token', id: 1, filters: {} }))

      expect(store.getState().budgetItem.budgetItems.length).toEqual(4)

      expect(res).toHaveProperty('data')
      expect(res).toHaveProperty('status')
    })

    test('Should get axios error when deleting budget item.', async () => {
      jest.spyOn(axios, 'delete').mockRejectedValueOnce(new Error('test error'))

      const res = await store.dispatch(deleteBudgetItem({ token: 'token', id: 1, filters: {} }))

      expect(res).toEqual({
        error: new Error('test error')
      })

      jest.spyOn(axios, 'delete').mockRestore()
    })

    test('Should update budget item.', async () => {
      const res = await store.dispatch(
        updateBudgetItem({ token: 'token', id: 1, categoryId: 21, name: 'test', value: 111, userDate: '2021-01-01', filters: {} })
      )

      expect(store.getState().budgetItem.budgetItems.length).toEqual(5)

      expect(store.getState().budgetItem.budgetItems[0]).toEqual({
        id: 1,
        category: { categoryType: 'expense', id: 21, name: 'car' },
        name: 'test',
        value: 111,
        userDate: '2021-01-01',
        ignore: false
      })

      expect(res).toHaveProperty('data')
      expect(res).toHaveProperty('status')
    })

    test('Should get axios error when updating budget item.', async () => {
      jest.spyOn(axios, 'put').mockRejectedValueOnce(new Error('test error'))

      const res = await store.dispatch(
        updateBudgetItem({ token: 'token', id: 1, categoryId: 21, name: 'test', value: 111, userDate: '2021-01-01', filters: {} })
      )

      expect(res).toEqual({
        error: new Error('test error')
      })

      jest.spyOn(axios, 'put').mockRestore()
    })
  })
})
