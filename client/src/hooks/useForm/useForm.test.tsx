import { render, screen } from '@testing-library/react'
import { cleanup, renderHook, waitFor } from '@testing-library/react'
import useForm, { FormConfig } from './useForm'
import { act } from 'react-dom/test-utils'
import { RenderWithProviders } from '../../utils/test-utils'
import { AxiosErrorPayload, ActionPayload, RegularErrorObject } from '../../types/store-actions'
import { ResCodes } from '../../types/enum'
import { FieldConfig } from '../useForm/useForm'
import userEvent from '@testing-library/user-event'
import { mockAction } from '../../utils/test-utils'
import * as budgetItemActions from '../../store/budget/budget-item-actions'

describe('useForm', () => {
  let fieldsConfig: FieldConfig[]
  let formConfig: FormConfig<ActionPayload<string> | RegularErrorObject | AxiosErrorPayload>

  beforeEach(() => {
    cleanup()
    jest.clearAllMocks()
    fieldsConfig = [
      {
        name: 'email',
        type: 'text',
        label: 'Email',
        errMsg: 'Email is invalid',
        validator: jest.fn(),
        state: { value: '', isValid: true, touched: true },
        dispatch: jest.fn(),
        attrs: { 'data-testid': 'email' }
      },
      {
        name: 'password',
        type: 'password',
        label: 'Password',
        errMsg: 'Password is invalid',
        validator: null,
        state: { value: '', isValid: true, touched: true },
        dispatch: jest.fn(),
        attrs: { 'data-testid': 'password' }
      },
      {
        id: 'plainText',
        type: 'text',
        label: 'Plain text',
        errMsg: 'Plain text is invalid',
        validator: null,
        state: { value: '', isValid: true, touched: true },
        dispatch: jest.fn(),
        name: 'plainText',
        attrs: { 'data-testid': 'plainText' }
      },
      {
        id: 'plainText1',
        type: 'text',
        label: 'Plain text',
        errMsg: 'Plain text is invalid',
        validator: null,
        state: { value: '', isValid: true, touched: true },
        dispatch: jest.fn(),
        name: 'plainText'
      }
    ]

    formConfig = {
      submitBtnText: 'Submit btn',
      submitAction: mockAction({ data: { message: 'hi', code: ResCodes.CREATE_BUDGET_ITEM, payload: 'hi' }, status: 200 }),
      submitActionData: { token: 'token' }
    }
  })

  test('Should render form', () => {
    const { result } = renderHook(() => useForm(fieldsConfig, formConfig), { wrapper: RenderWithProviders })
    render(result.current.formMarkup)

    expect(screen.getByTestId('useForm')).toBeInTheDocument()
  })

  test('Should render fields', () => {
    const { result } = renderHook(() => useForm(fieldsConfig, formConfig), { wrapper: RenderWithProviders })
    render(result.current.formMarkup)

    expect(screen.getByTestId('email')).toBeInTheDocument()
    expect(screen.getByTestId('password')).toBeInTheDocument()
  })

  test('Should render submit button', () => {
    const { result } = renderHook(() => useForm(fieldsConfig, formConfig), { wrapper: RenderWithProviders })
    render(result.current.formMarkup)

    expect(screen.getByText('Submit btn')).toBeInTheDocument()
  })

  test('Should call submit handler', async () => {
    const { result } = renderHook(() => useForm(fieldsConfig, formConfig), { wrapper: RenderWithProviders })
    render(result.current.formMarkup)

    await act(async () => {
      await screen.getByTestId('submitBtn').click()
    })

    expect(formConfig.submitAction).toBeCalled()
  })

  test('Should call submit handler with correct data', async () => {
    const { result } = renderHook(() => useForm(fieldsConfig, formConfig), { wrapper: RenderWithProviders })
    render(result.current.formMarkup)

    await act(async () => {
      await screen.getByTestId('submitBtn').click()
    })

    expect(formConfig.submitAction).toBeCalledWith({ token: 'token' })
  })

  test('Should dispatch fields actions', async () => {
    const { result } = renderHook(() => useForm(fieldsConfig, formConfig), { wrapper: RenderWithProviders })
    render(result.current.formMarkup)

    await act(async () => {
      await userEvent.type(screen.getByTestId('email'), 'hi')
      await userEvent.type(screen.getByTestId('password'), 'ciao')
    })

    expect(fieldsConfig[0].dispatch).toBeCalled()
    expect(fieldsConfig[1].dispatch).toBeCalled()
  })

  test('Should dispatch fields actions with correct data', async () => {
    const { result } = renderHook(() => useForm(fieldsConfig, formConfig), { wrapper: RenderWithProviders })
    render(result.current.formMarkup)

    await act(async () => {
      await userEvent.type(screen.getByTestId('email'), 'h')
      await userEvent.type(screen.getByTestId('password'), 'c')
    })

    expect(fieldsConfig[0].dispatch).toBeCalledWith({
      type: 'set&check',
      payload: { value: 'h', touched: true },
      validation: fieldsConfig[0].validator
    })
    expect(fieldsConfig[1].dispatch).toBeCalledWith({
      type: 'set',
      payload: { value: 'c', touched: true }
    })
  })

  test('Should dispatch field action for checkbox', async () => {
    fieldsConfig[1].type = 'checkbox'
    const { result } = renderHook(() => useForm(fieldsConfig, formConfig), { wrapper: RenderWithProviders })
    render(result.current.formMarkup)

    await act(async () => {
      await userEvent.click(screen.getByTestId('password'))
    })

    expect(fieldsConfig[1].dispatch).toBeCalledWith({
      type: 'set',
      payload: { value: 'true', touched: true }
    })
  })

  test('Only called plainText dispatch once', async () => {
    const { result } = renderHook(() => useForm(fieldsConfig, formConfig), { wrapper: RenderWithProviders })
    render(result.current.formMarkup)

    await act(async () => {
      await userEvent.type(screen.getByTestId('plainText'), 'h')
    })

    expect(fieldsConfig[2].dispatch).toBeCalledTimes(1)
    expect(fieldsConfig[3].dispatch).toBeCalledTimes(0)
  })

  test('Call onSubmit event', async () => {
    const onSubmit = jest.fn()
    const { result } = renderHook(() => useForm(fieldsConfig, { ...formConfig }, { onSubmit }), { wrapper: RenderWithProviders })
    render(result.current.formMarkup)

    await act(async () => {
      await screen.getByTestId('submitBtn').click()
    })

    expect(onSubmit).toBeCalled()
  })

  test('Call onGetResponse event', async () => {
    const onGetResponse = jest.fn()

    const { result } = renderHook(() => useForm(fieldsConfig, { ...formConfig }, { onGetResponse }), { wrapper: RenderWithProviders })
    render(result.current.formMarkup)

    await act(async () => {
      await screen.getByTestId('submitBtn').click()
    })

    await waitFor(() => {
      expect(onGetResponse).toBeCalledWith({ data: { message: 'hi', code: ResCodes.CREATE_BUDGET_ITEM, payload: 'hi' }, status: 200 })
    })
  })

  test('Call onReject event if axios error', async () => {
    const onReject = jest.fn()
    formConfig.submitAction = mockAction({ errorMsg: 'test', data: {} as JSONResponse, status: 500 })

    const { result } = renderHook(() => useForm(fieldsConfig, { ...formConfig }, { onReject }), { wrapper: RenderWithProviders })
    render(result.current.formMarkup)

    await act(async () => {
      await screen.getByTestId('submitBtn').click()
    })

    await waitFor(() => {
      expect(onReject).toBeCalledWith({ errorMsg: 'test', data: {} as JSONResponse, status: 500 }, true)
    })
  })

  test("Don't call onReject event if regular error", async () => {
    const onReject = jest.fn()
    formConfig.submitAction = mockAction({ error: new Error('test') })

    const { result } = renderHook(() => useForm(fieldsConfig, { ...formConfig }, { onReject }), { wrapper: RenderWithProviders })
    render(result.current.formMarkup)

    await act(async () => {
      await screen.getByTestId('submitBtn').click()
    })

    await waitFor(() => {
      expect(onReject).not.toBeCalled()
    })
  })

  test('Should render field with data list', async () => {
    fieldsConfig[2].dataList = true

    const searchNames = jest.spyOn(budgetItemActions, 'searchNames').mockImplementation(() => {
      return async (dispatch, getState) => {
        return { data: { payload: ['hi'] }, status: 200 } as ActionPayload<string[]>
      }
    })

    const { result } = renderHook(() => useForm(fieldsConfig, formConfig), { wrapper: RenderWithProviders })
    render(result.current.formMarkup)

    await act(async () => {
      userEvent.type(screen.getByTestId('plainText'), 'h')
    })

    await waitFor(() => {
      expect(searchNames).toBeCalledWith({ name: 'h', token: 'token' })
    })

    jest.restoreAllMocks()
  })
})
