import React, { Fragment } from 'react'
import { useAppSelector } from '../../hooks/useReduxTS'

import ChangeCredentialsForm from '../auth/ChangeCredentialsForm/ChangeCredentialsForm'

const ProgilePage = () => {
  const email = useAppSelector((state) => state.user.email)
  const token = useAppSelector((state) => state.user.token)
  const [openEmailForm, setOpenEmailForm] = React.useState(false)
  const [openPasswordForm, setOpenPasswordForm] = React.useState(false)

  const changeEmailHandler = () => {
    setOpenEmailForm((prev) => !prev)
    setOpenPasswordForm(false)
  }

  const changePasswordHandler = () => {
    setOpenPasswordForm((prev) => !prev)
    setOpenEmailForm(false)
  }

  return (
    <Fragment>
      <h1>Profile</h1>
      <div>
        <p>email: {email}</p>
        <button onClick={changeEmailHandler}>Change email</button>
        <button onClick={changePasswordHandler}>Change password</button>
      </div>
      {openEmailForm && <ChangeCredentialsForm fieldName="email" token={token!} onEdit={() => setOpenEmailForm(false)} />}
      {openPasswordForm && <ChangeCredentialsForm fieldName="password" token={token!} onEdit={() => setOpenPasswordForm(false)} />}
    </Fragment>
  )
}

export default ProgilePage
