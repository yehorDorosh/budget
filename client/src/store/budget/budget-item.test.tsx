import store from '..'
import { budgetItemActions } from './budget-item-slice'
import { CategoryType, QueryFilter, ResCodes } from '../../types/enum'
import { addBudgetItem, getBudgetItems, deleteBudgetItem, updateBudgetItem, getStatistics, getMonthlyTrend } from './budget-item-actions'
import { setupServer } from 'msw/node'
import { handlers } from '../../utils/test-utils'
import { ActionPayload, isActionPayload } from '../../types/store-actions'
import axios from 'axios'

describe('BudgetItem Store', () => {
  describe('reducers', () => {
    afterEach(() => {
      store.dispatch(budgetItemActions.setFilterMonth(''))
      store.dispatch(budgetItemActions.setFilterYear(''))
      store.dispatch(budgetItemActions.setActiveFilter(QueryFilter.MONTH))
      store.dispatch(budgetItemActions.setFilterName(''))
      store.dispatch(budgetItemActions.setFilterCategoryType(''))
      store.dispatch(budgetItemActions.setFilterCategory(''))
      store.dispatch(budgetItemActions.setFilterIgnore(false))
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

    test('Should increment page.', () => {
      store.dispatch(budgetItemActions.incrementPage())

      expect(store.getState().budgetItem.filters.page).toEqual(2)
    })

    test('Should reset page.', () => {
      store.dispatch(budgetItemActions.incrementPage())
      store.dispatch(budgetItemActions.resetPage())

      expect(store.getState().budgetItem.filters.page).toEqual(1)
    })

    test('Should toggle onChangeBudgetItems.', () => {
      store.dispatch(budgetItemActions.onChangeBudgetItems())
      expect(store.getState().budgetItem.onChangeBudgetItems).toEqual(true)

      store.dispatch(budgetItemActions.onChangeBudgetItems())
      expect(store.getState().budgetItem.onChangeBudgetItems).toEqual(false)
    })
  })

  describe('actions', () => {
    const dispatch = store.dispatch
    const server = setupServer(...handlers)

    afterEach(() => {
      server.resetHandlers()
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
      const res = await dispatch(addBudgetItem({ token: 'token', categoryId: 21, name: 'test', value: 111, userDate: '2021-01-01' }))

      if (isActionPayload(res)) {
        payload = res.data.payload
      }

      expect((res as ActionPayload<BudgetItemPayload>).data.payload?.budgetItems.length).toEqual(6)
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

      const res = await dispatch(addBudgetItem({ token: 'token', categoryId: 21, name: 'test', value: 111, userDate: '2021-01-01' }))

      expect(res).toEqual({
        error: new Error('test error')
      })

      jest.spyOn(axios, 'post').mockRestore()
    })

    test('Should get budget items.', async () => {
      const res = await store.dispatch(getBudgetItems({ token: 'token' }))

      expect(isActionPayload(res)).toEqual(true)
      expect((res as ActionPayload<BudgetItemPayload>).data.payload?.budgetItems.length).toEqual(5)

      expect(res).toHaveProperty('data')
      expect(res).toHaveProperty('status')
    })

    test('Should get axios error when getting budget items.', async () => {
      jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('test error'))

      const res = await store.dispatch(getBudgetItems({ token: 'token' }))

      expect(res).toEqual({
        error: new Error('test error')
      })

      jest.spyOn(axios, 'get').mockRestore()
    })

    test('Should get statistics.', async () => {
      const res = await store.dispatch(getStatistics({ token: 'token' }))

      expect(res).toEqual({
        data: {
          code: ResCodes.GET_STATISTICS,
          message: 'Statistics provided successfully.',
          payload: {
            incomes: '1000',
            expenses: '1000',
            sum: '0.00',
            categoriesRates: [{ name: 'car', sum: '100' }]
          }
        },
        status: 200
      })
    })

    test('Should get axios error when getting statistics.', async () => {
      jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('test error'))

      const res = await store.dispatch(getStatistics({ token: 'token' }))

      expect(res).toEqual({
        error: new Error('test error')
      })

      jest.spyOn(axios, 'get').mockRestore()
    })

    test('Should delete budget item.', async () => {
      const res = await store.dispatch(deleteBudgetItem({ token: 'token', id: 1 }))

      expect(isActionPayload(res)).toEqual(true)
      expect((res as ActionPayload<BudgetItemPayload>).data.payload?.budgetItems.length).toEqual(4)

      expect(res).toHaveProperty('data')
      expect(res).toHaveProperty('status')
    })

    test('Should get axios error when deleting budget item.', async () => {
      jest.spyOn(axios, 'delete').mockRejectedValueOnce(new Error('test error'))

      const res = await store.dispatch(deleteBudgetItem({ token: 'token', id: 1 }))

      expect(res).toEqual({
        error: new Error('test error')
      })

      jest.spyOn(axios, 'delete').mockRestore()
    })

    test('Should update budget item.', async () => {
      const res = await store.dispatch(
        updateBudgetItem({ token: 'token', id: 1, categoryId: 21, name: 'test', value: 111, userDate: '2021-01-01' })
      )
      expect(isActionPayload(res)).toEqual(true)
      expect((res as ActionPayload<BudgetItemPayload>).data.payload?.budgetItems.length).toEqual(5)

      expect((res as ActionPayload<BudgetItemPayload>).data.payload?.budgetItems[0]).toEqual({
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
        updateBudgetItem({ token: 'token', id: 1, categoryId: 21, name: 'test', value: 111, userDate: '2021-01-01' })
      )

      expect(res).toEqual({
        error: new Error('test error')
      })

      jest.spyOn(axios, 'put').mockRestore()
    })

    test('Should get monthly trend.', async () => {
      const res = await store.dispatch(getMonthlyTrend({ token: 'token', year: 2023 }))

      expect(res).toEqual({
        data: {
          code: ResCodes.GET_MONTHLY_TREND,
          message: 'Monthly trend provided successfully.',
          payload: {
            aveExpenses: '1000.00',
            aveIncomes: '1000.00',
            aveSaved: '0.00',
            totalSaved: '0.00',
            monthlyExpenses: [{ month: '0', total: '1000.00' }],
            monthlyIncomes: [{ month: '0', total: '1000.00' }]
          }
        },
        status: 200
      })
    })

    test('Should get axios error when getting monthly trend.', async () => {
      jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('test error'))

      const res = await store.dispatch(getMonthlyTrend({ token: 'token', year: 2023 }))

      expect(res).toEqual({
        error: new Error('test error')
      })

      jest.spyOn(axios, 'get').mockRestore()
    })
  })
})
