import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

interface Props {
  token: string
}

const SignupForm: React.FC<Props> = ({ token }) => {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')

  function passwordHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value)
  }

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      const { data, status } = await axios.post(
        `/api/user/restore-password/${token}`,
        {
          newPassword: password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      console.log(data, status)
      navigate('/login', { replace: true })
    } catch (error) {
      console.log(error)
    }
    setPassword('')
  }

  return (
    <form onSubmit={submitHandler} noValidate>
      <input type="password" placeholder="password" name="newPassword" onChange={passwordHandler} value={password} />
      <button type="submit">Set new password</button>
    </form>
  )
}

export default SignupForm
