import { Fragment } from 'react'

import SignupForm from '../../auth/SignupForm/SignupForm'

const SignupPage = () => {
  return (
    <Fragment>
      <h1 className="text-center">Sign Up</h1>
      <SignupForm />
    </Fragment>
  )
}

export default SignupPage
