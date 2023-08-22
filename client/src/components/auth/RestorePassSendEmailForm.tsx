import { useState } from 'react'
import axios from 'axios'

const SignupForm = () => {
  const [email, setEmail] = useState('')

  function emailHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value)
  }

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      const { data, status } = await axios.post(
        '/api/user/restore-password',
        {
          email
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      console.log(data, status)
    } catch (error) {
      console.log(error)
    }
    setEmail('')
  }

  return (
    <form onSubmit={submitHandler} noValidate>
      <input type="email" placeholder="email" name="email" onChange={emailHandler} value={email} />
      <button type="submit">Send email</button>
    </form>
  )
}

export default SignupForm
