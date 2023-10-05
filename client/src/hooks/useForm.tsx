import BaseForm from '../components/ui/BaseForm/BaseForm'
import BaseInput from '../components/ui/BaseInput/BaseInput'
import SelectInput, { SelectOption } from '../components/ui/SelectInput/SelectInput'
import { FieldState, Action as UseFieldAction } from './useFiled/useField'
import useSubmit from './useFormSubmit/useFormSubmit'
import { StoreAction, isActionPayload, isAxiosErrorPayload } from '../types/store-actions'
import { StoreActionData } from '../types/store-actions'

interface FieldConfig {
  id?: string
  name: string
  type: string
  label: string
  placeholder?: string
  errMsg: string
  validator: ValidationFunction | null
  state: FieldState
  dispatch: React.Dispatch<UseFieldAction>
  defaultValue?: string
  options?: SelectOption[]
  attrs?: { [key: string]: string | boolean }
}

interface FormConfig<T = void> {
  submitBtnText: string
  submitAction: StoreAction<T>
  submitActionData: StoreActionData
  errMsg?: string
}

interface FormEvents {
  onSubmit?: () => void
  onGetResponse?: (res: any) => void
  onReject?: (res: any, isAxiosErrorPayload: boolean) => void
}

const useForm = <T,>(fieldsConfig: FieldConfig[], formConfig: FormConfig<T>, formEvents: FormEvents = {}) => {
  const { submit, isLoading, validationErrorsBE } = useSubmit()

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const fieldConfig = fieldsConfig.find((field) => {
      if (field.id) {
        return field.id === e.target.id
      } else {
        return field.name === e.target.name
      }
    })
    if (!fieldConfig) return console.error('useForm.tsx: Field not found')
    if (fieldConfig.validator) {
      fieldConfig.dispatch({ type: 'set&check', payload: { value: e.target.value, touched: true }, validation: fieldConfig.validator })
    } else if (fieldConfig.type === 'checkbox' && e.target instanceof HTMLInputElement) {
      fieldConfig.dispatch({ type: 'set', payload: { value: String(e.target.checked), touched: true } })
    } else {
      fieldConfig.dispatch({ type: 'set', payload: { value: e.target.value, touched: true } })
    }
  }

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (formEvents.onSubmit) formEvents.onSubmit()
    const res = await submit(
      fieldsConfig.map((field) => field.state),
      new Map(fieldsConfig.map((field) => [field.dispatch, field.validator])),
      formConfig.submitAction,
      formConfig.submitActionData
    )
    if (formEvents.onGetResponse && res && isActionPayload(res)) formEvents.onGetResponse(res)
    if (formEvents.onReject && res && !isActionPayload(res)) formEvents.onReject(res, isAxiosErrorPayload(res))
  }

  const defaultMarkup = (
    <BaseForm
      onSubmit={submitHandler}
      isLoading={isLoading}
      errors={validationErrorsBE || formConfig.errMsg}
      className={fieldsConfig.some((field) => field.validator !== null) ? 'needs-validation' : ''}
    >
      {fieldsConfig.map((field, i) => {
        return field.type === 'select' ? (
          <SelectInput
            key={field.id || field.name + i}
            id={field.id || field.name + i}
            options={field.options || []}
            label={field.label}
            isValid={field.state.isValid}
            msg={field.errMsg}
            type={field.type}
            name={field.name}
            onChange={inputHandler}
            value={field.state.touched ? field.state.value : field.defaultValue ? field.defaultValue : ''}
            required={field.validator !== null}
            {...field.attrs}
          />
        ) : (
          <BaseInput
            key={field.id || field.name + i}
            id={field.id || field.name + i}
            label={field.label}
            isValid={field.state.isValid}
            msg={field.errMsg}
            type={field.type}
            placeholder={field.placeholder}
            name={field.name}
            onChange={inputHandler}
            value={field.state.touched && field.type !== 'radio' ? field.state.value : field.defaultValue ? field.defaultValue : ''}
            required={field.validator !== null}
            {...field.attrs}
          />
        )
      })}
      <button type="submit" className="btn btn-primary" data-testid="submitBtn">
        {formConfig.submitBtnText}
      </button>
    </BaseForm>
  )
  return {
    formMarkup: defaultMarkup
  }
}

export default useForm
