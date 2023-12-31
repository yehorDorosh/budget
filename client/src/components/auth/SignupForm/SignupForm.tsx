import { useNavigate } from 'react-router-dom'

import { emailValidator, passwordValidator, shouldMatchValidator } from '../../../utils/validators'
import useField from '../../../hooks/useFiled/useField'
import useForm from '../../../hooks/useForm/useForm'
import { signUp } from '../../../store/user/user-actions'
import BaseCard from '../../ui/BaseCard/BaseCard'

const SignupForm = () => {
  const navigate = useNavigate()
  const { fieldState: emailState, fieldDispatch: emailDispatch } = useField()
  const { fieldState: passwordState, fieldDispatch: passwordDispatch } = useField()
  const { fieldState: confirmPasswordState, fieldDispatch: confirmPasswordDispatch } = useField()
  const { formMarkup } = useForm<UserPayload>(
    [
      {
        name: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'email',
        errMsg: 'Please enter a valid email.',
        validator: emailValidator,
        state: emailState,
        dispatch: emailDispatch,
        attrs: { 'data-testid': 'email' }
      },
      {
        name: 'password',
        type: 'password',
        label: 'Password',
        placeholder: 'password',
        errMsg: 'Password should contain at least 8 symbols. At least one char in upper case and at least 1 number.',
        validator: passwordValidator,
        state: passwordState,
        dispatch: passwordDispatch,
        attrs: { 'data-testid': 'password' }
      },
      {
        name: 'confirmPassword',
        type: 'password',
        label: 'Confirm password',
        placeholder: 'confirm password',
        errMsg: 'Passwords do not match.',
        validator: shouldMatchValidator.bind(null, passwordState.value),
        state: confirmPasswordState,
        dispatch: confirmPasswordDispatch,
        attrs: { 'data-testid': 'confirmPassword' }
      }
    ],
    { submitBtnText: 'Sign Up', submitAction: signUp, submitActionData: { email: emailState.value, password: passwordState.value } },
    {
      onGetResponse: () => navigate('/', { replace: true })
    }
  )

  return <BaseCard data-testid="signup-form">{formMarkup}</BaseCard>
}

export default SignupForm
