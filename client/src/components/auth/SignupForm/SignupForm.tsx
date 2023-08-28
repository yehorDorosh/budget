import { useNavigate } from 'react-router-dom'

// import classes from './SignupForm.module.scss'

import { emailValidator, passwordValidator, shouldMatchValidator } from '../../../utils/validators'
import useField from '../../../hooks/useField'
import useFormSubmit from '../../../hooks/useFormSubmit'
import { signUp } from '../../../store/user/user-actions'
import BaseForm from '../../ui/BaseForm/BaseForm'
import BaseInput from '../../ui/BaseInput/BaseInput'

const SignupForm = () => {
  const navigate = useNavigate()
  const submit = useFormSubmit()
  const { fieldState: emailState, filedDispatch: emailDispatch } = useField()
  const { fieldState: passwordState, filedDispatch: passwordDispatch } = useField()
  const { fieldState: confirmPasswordState, filedDispatch: confirmPasswordDispatch } = useField()

  function emailHandler(e: React.ChangeEvent<HTMLInputElement>) {
    emailDispatch({ type: 'set', payload: { value: e.target.value, touched: true }, validation: emailValidator })
  }

  function passwordHandler(e: React.ChangeEvent<HTMLInputElement>) {
    passwordDispatch({ type: 'set', payload: { value: e.target.value, touched: true }, validation: passwordValidator })
  }

  function confirmPasswordHandler(e: React.ChangeEvent<HTMLInputElement>) {
    confirmPasswordDispatch({
      type: 'set',
      payload: { value: e.target.value, touched: true },
      validation: shouldMatchValidator.bind(null, passwordState.value)
    })
  }

  function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    submit<UserPayload>(
      [emailState, passwordState, confirmPasswordState],
      new Map([
        [emailDispatch, emailValidator],
        [passwordDispatch, passwordValidator],
        [confirmPasswordDispatch, shouldMatchValidator.bind(null, passwordState.value)]
      ]),
      signUp,
      [emailState.value, passwordState.value],
      () => navigate('/', { replace: true })
    )
  }

  return (
    <BaseForm onSubmit={submitHandler} noValidate>
      <BaseInput
        label="Email"
        isValid={emailState.isValid}
        msg="Please enter a valid email."
        type="email"
        placeholder="email"
        name="email"
        onChange={emailHandler}
        value={emailState.value}
      />
      <BaseInput
        label="Password"
        isValid={passwordState.isValid}
        msg="Password should contain at least 8 symbols. At least one char in upper case and at least 1 number."
        type="password"
        placeholder="password"
        name="password"
        onChange={passwordHandler}
        value={passwordState.value}
      />
      <BaseInput
        label="Confirm password"
        isValid={confirmPasswordState.isValid}
        msg="Passwords do not match."
        type="password"
        placeholder="confirm password"
        name="confirmPassword"
        onChange={confirmPasswordHandler}
        value={confirmPasswordState.value}
      />
      <button type="submit">Sign Up</button>
    </BaseForm>
  )
}

export default SignupForm
