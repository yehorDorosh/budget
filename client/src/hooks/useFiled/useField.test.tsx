import { cleanup, renderHook } from '@testing-library/react'
import useField from './useField'
import { act } from 'react-dom/test-utils'

describe('useField', () => {
  beforeEach(() => {
    cleanup()
  })

  test('Should return default value', () => {
    const { result } = renderHook(() => useField('Hi'))

    expect(result.current.fieldState.value).toBe('Hi')
  })

  test('Should be touched if default value is not empty.', () => {
    const { result } = renderHook(() => useField('Hi'))

    expect(result.current.fieldState.touched).toBe(true)
  })

  test('Should be untouched if default value is empty.', () => {
    const { result } = renderHook(() => useField())

    expect(result.current.fieldState.touched).toBe(false)
  })

  test('Should set new value.', () => {
    const { result } = renderHook(() => useField('Hi'))

    expect(result.current.fieldState.value).toBe('Hi')

    act(() => {
      result.current.fieldDispatch({ type: 'set', payload: { value: 'Hello' } })
    })

    expect(result.current.fieldState.value).toBe('Hello')
  })

  test('Should set filed touched.', () => {
    const { result } = renderHook(() => useField())

    expect(result.current.fieldState.touched).toBe(false)

    act(() => {
      result.current.fieldDispatch({ type: 'set', payload: { value: 'Hello', touched: true } })
    })

    expect(result.current.fieldState.touched).toBe(true)
  })

  test('Should clear field.', () => {
    const { result } = renderHook(() => useField())

    act(() => {
      result.current.fieldDispatch({ type: 'set', payload: { value: 'Hello', touched: true } })
    })

    act(() => {
      result.current.fieldDispatch({ type: 'clear' })
    })

    expect(result.current.fieldState.value).toBe('')
    expect(result.current.fieldState.touched).toBe(false)
    expect(result.current.fieldState.isValid).toBe(true)
  })

  test('To be validate as valid.', () => {
    const { result } = renderHook(() => useField())

    act(() => {
      result.current.fieldDispatch({ type: 'set', payload: { value: 'Hello', touched: true } })
    })

    act(() => {
      result.current.fieldDispatch({ type: 'validate', validation: (value: string) => value.length > 3 })
    })

    expect(result.current.fieldState.isValid).toBe(true)
  })

  test('To be validate as invalid.', () => {
    const { result } = renderHook(() => useField())

    act(() => {
      result.current.fieldDispatch({ type: 'set', payload: { value: 'Hello', touched: true } })
    })

    act(() => {
      result.current.fieldDispatch({ type: 'validate', validation: (value: string) => value.length > 10 })
    })

    expect(result.current.fieldState.isValid).toBe(false)
  })

  test('Should be valid, touched and has value "Hello" after set&check.', () => {
    const { result } = renderHook(() => useField())

    act(() => {
      result.current.fieldDispatch({
        type: 'set&check',
        payload: { value: 'Hello', touched: true },
        validation: (value: string) => value.length > 3
      })
    })

    expect(result.current.fieldState.isValid).toBe(true)
    expect(result.current.fieldState.value).toBe('Hello')
    expect(result.current.fieldState.touched).toBe(true)
  })

  test('Should be valid and has value "Hello" after set&check.', () => {
    const { result } = renderHook(() => useField())

    act(() => {
      result.current.fieldDispatch({
        type: 'set&check',
        payload: { value: 'Hello' },
        validation: (value: string) => value.length > 3
      })
    })

    expect(result.current.fieldState.isValid).toBe(true)
    expect(result.current.fieldState.value).toBe('Hello')
    expect(result.current.fieldState.touched).toBe(undefined)
  })

  test('Should be valid, touched and has value "Hello" after set&check with default value', () => {
    const { result } = renderHook(() => useField('Hi'))

    act(() => {
      result.current.fieldDispatch({
        type: 'set&check',
        payload: { value: 'Hello' },
        validation: (value: string) => value.length > 3
      })
    })

    expect(result.current.fieldState.isValid).toBe(true)
    expect(result.current.fieldState.value).toBe('Hello')
    expect(result.current.fieldState.touched).toBe(undefined)
  })

  test('Should be invalid, touched and has value "Hello" after set&check', () => {
    const { result } = renderHook(() => useField())

    act(() => {
      result.current.fieldDispatch({
        type: 'set&check',
        payload: { value: 'Hello', touched: true },
        validation: (value: string) => value.length > 10
      })
    })

    expect(result.current.fieldState.isValid).toBe(false)
    expect(result.current.fieldState.value).toBe('Hello')
    expect(result.current.fieldState.touched).toBe(true)
  })
})
