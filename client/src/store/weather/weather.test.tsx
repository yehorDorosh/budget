import store from '..'
import { weatherActions } from './weather-slice'
import { getWeather, getLastWeather } from './weather-actions'
import { setupServer } from 'msw/node'
import { handlers } from '../../utils/test-utils'
import axios from 'axios'

describe('Weather Store', () => {
  describe('reducers', () => {
    afterEach(() => {
      store.dispatch(weatherActions.setWeather([]))
    })

    test('Should set weather.', () => {
      const weather = { id: '1', t: 10, p: 1000, v: 4, regDate: '2023-09-14 00:00:00', dbId: 1 }
      store.dispatch(weatherActions.setWeather([weather]))

      expect(store.getState().weather.weather).toEqual([weather])
    })
  })

  describe('actions', () => {
    const server = setupServer(...handlers)

    afterEach(() => {
      server.resetHandlers()
      store.dispatch(weatherActions.setWeather([]))
    })

    beforeAll(() => {
      server.listen()
    })

    afterAll(() => {
      server.close()
    })

    test('Should get last weather.', async () => {
      await store.dispatch(getLastWeather({}))

      expect(store.getState().weather.weather).toHaveLength(3)
    })

    test('Should return axios error when get last weather.', async () => {
      jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('test error'))

      const res = await store.dispatch(getLastWeather({}))

      expect(res).toEqual({
        error: new Error('test error')
      })

      jest.spyOn(axios, 'get').mockRestore()
    })

    test('Should get weather.', async () => {
      await store.dispatch(getWeather({}))

      expect(store.getState().weather.weather).toHaveLength(6)
    })

    test('Should return axios error when get weather.', async () => {
      jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('test error'))

      const res = await store.dispatch(getWeather({}))

      expect(res).toEqual({
        error: new Error('test error')
      })

      jest.spyOn(axios, 'get').mockRestore()
    })
  })
})
