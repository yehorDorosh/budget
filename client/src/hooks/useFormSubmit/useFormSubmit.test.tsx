import { cleanup, renderHook, waitFor } from '@testing-library/react'
import useFormSubmit from './useFormSubmit'
import { act } from 'react-dom/test-utils'
import { RenderWithProviders } from '../../utils/test-utils'
import { StoreAction, AxiosErrorPayload, ActionPayload, RegularErrorObject } from '../../types/store-actions'
import { ResCodes } from '../../types/enum'

const mockedNavigation = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigation
}))

function mockAction<T>(payload: T): StoreAction<T> {
  return jest.fn(() => async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(payload)
      }, 100)
    })
  }) as unknown as StoreAction<T>
}

describe('useFormSubmit', () => {
  let fields: any[]

  const fieldsDispatch = new Map()
  const field1Dispatch = jest.fn()
  const field2Dispatch = jest.fn()
  const validator = jest.fn()

  let action: StoreAction<void | { type?: string; payload?: string } | AxiosErrorPayload | RegularErrorObject | ActionPayload<string>>

  beforeEach(() => {
    cleanup()
    jest.clearAllMocks()
    fields = [
      { value: 'hi', isValid: true, touched: true },
      { value: 'ciao', isValid: true, touched: true }
    ]
    fieldsDispatch.set(field1Dispatch, validator)
    fieldsDispatch.set(field2Dispatch, validator)
    action = jest.fn(() => ({ type: 'test' })) as unknown as StoreAction
  })

  test('Should return default values.', () => {
    const { result } = renderHook(() => useFormSubmit(), { wrapper: RenderWithProviders })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.validationErrorsBE).toBe(undefined)
    expect(result.current.submit).toBeInstanceOf(Function)
  })

  test('Should call fields validation functions.', async () => {
    const { result } = renderHook(() => useFormSubmit(), { wrapper: RenderWithProviders })

    await act(async () => {
      await result.current.submit(fields, fieldsDispatch, action, {})
    })

    expect(field1Dispatch).toBeCalledWith({ type: 'validate', validation: validator })
    expect(field2Dispatch).toBeCalledWith({ type: 'validate', validation: validator })
  })

  test('Should call fields clear action', async () => {
    const { result } = renderHook(() => useFormSubmit(), { wrapper: RenderWithProviders })

    await act(async () => {
      await result.current.submit(fields, fieldsDispatch, action, {})
    })

    expect(field1Dispatch).toBeCalledWith({ type: 'clear' })
    expect(field2Dispatch).toBeCalledWith({ type: 'clear' })
  })

  test('Should call only actions with validation functions.', async () => {
    const { result } = renderHook(() => useFormSubmit(), { wrapper: RenderWithProviders })

    fieldsDispatch.set(field1Dispatch, null)

    await act(async () => {
      await result.current.submit(fields, fieldsDispatch, action, {})
    })

    expect(field1Dispatch).not.toBeCalledWith({ type: 'validate', validation: validator })
    expect(field2Dispatch).toBeCalledWith({ type: 'validate', validation: validator })
  })

  test('Should not call any actions if fields are not valid', async () => {
    const { result } = renderHook(() => useFormSubmit(), { wrapper: RenderWithProviders })

    fields[0].isValid = false

    await act(async () => {
      await result.current.submit(fields, fieldsDispatch, action, {})
    })

    expect(action).not.toBeCalled()
  })

  test('Should not call any actions if fields are not touched.', async () => {
    const { result } = renderHook(() => useFormSubmit(), { wrapper: RenderWithProviders })

    fields[0].touched = false

    await act(async () => {
      await result.current.submit(fields, fieldsDispatch, action, {})
    })

    expect(action).not.toBeCalled()
  })

  test('Should call action if fields are valid and touched', async () => {
    const { result } = renderHook(() => useFormSubmit(), { wrapper: RenderWithProviders })

    await act(async () => {
      await result.current.submit(fields, fieldsDispatch, action, {})
    })

    expect(action).toBeCalled()
  })

  test('Should set isLoading to true before action call.', async () => {
    const { result } = renderHook(() => useFormSubmit(), { wrapper: RenderWithProviders })

    action = mockAction({ type: 'test' })

    await act(async () => {
      result.current.submit(fields, fieldsDispatch, action, {})
    })

    expect(result.current.isLoading).toBe(true)
  })

  test('Should set isLoading to false after action call.', async () => {
    const { result } = renderHook(() => useFormSubmit(), { wrapper: RenderWithProviders })

    action = mockAction({ type: 'test' })

    await act(async () => {
      result.current.submit(fields, fieldsDispatch, action, {})
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })

  test('Return axios error.', async () => {
    let res: AxiosErrorPayload | undefined
    const { result } = renderHook(() => useFormSubmit(), { wrapper: RenderWithProviders })

    action = mockAction({ errorMsg: 'test', data: {} as JSONResponse, status: 500 })

    await act(async () => {
      res = (await result.current.submit(fields, fieldsDispatch, action, {})) as AxiosErrorPayload
    })

    expect(res?.errorMsg).toEqual('test')
  })

  test('Return axios validation error.', async () => {
    const { result } = renderHook(() => useFormSubmit(), { wrapper: RenderWithProviders })

    action = mockAction({ errorMsg: 'test', data: { validationErrors: [{ msg: 'test' }] } as JSONResponse, status: 422 })

    await act(async () => {
      await result.current.submit(fields, fieldsDispatch, action, {})
    })

    expect(result.current.validationErrorsBE).toEqual([{ msg: 'test' }])
  })

  test('Redirect to 500 page if status code 500.', async () => {
    const { result } = renderHook(() => useFormSubmit(), { wrapper: RenderWithProviders })

    action = mockAction({ errorMsg: 'test', data: {} as JSONResponse, status: 500 })

    await act(async () => {
      await result.current.submit(fields, fieldsDispatch, action, {})
    })

    await waitFor(() => {
      expect(mockedNavigation).toHaveBeenCalledWith('/500', { state: { data: { errorMsg: 'test', data: {}, status: 500 } } })
    })
  })

  test('Return regular error object with redirect.', async () => {
    const { result } = renderHook(() => useFormSubmit(), { wrapper: RenderWithProviders })
    const err = new Error('test')

    action = mockAction({ error: err })

    await act(async () => {
      await result.current.submit(fields, fieldsDispatch, action, {})
    })

    expect(mockedNavigation).toHaveBeenCalledWith('/500', { state: { data: { error: err } } })
  })

  test('Return action payload. Successful submit.', async () => {
    let res: ActionPayload<{ payload: string }> | undefined
    const { result } = renderHook(() => useFormSubmit(), { wrapper: RenderWithProviders })

    action = mockAction({ data: { message: 'hi', code: ResCodes.CREATE_BUDGET_ITEM, payload: 'hi' }, status: 200 })

    await act(async () => {
      res = (await result.current.submit(fields, fieldsDispatch, action, {})) as ActionPayload<{ payload: string }>
    })

    expect(res?.data.payload).toEqual('hi')
  })
})
