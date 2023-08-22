import { useState } from 'react'
import { useAppDispatch } from '../../hooks/useReduxTS'

import { signUp } from '../../store/user/user-actions'

const SignupForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useAppDispatch()

  function emailHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value)
  }

  function passwordHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value)
  }

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    dispatch(signUp(email, password))
    setEmail('')
    setPassword('')
  }

  return (
    <form onSubmit={submitHandler} noValidate>
      <input type="email" placeholder="email" name="email" onChange={emailHandler} value={email} />
      <input type="password" placeholder="password" name="password" onChange={passwordHandler} value={password} />
      <button type="submit">Sign Up</button>
    </form>
  )
}

export default SignupForm
