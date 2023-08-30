import React, { Fragment, useState } from 'react'
import { useAppSelector } from '../../hooks/useReduxTS'

import ChangeCredentialsForm from '../auth/ChangeCredentialsForm/ChangeCredentialsForm'
import DeleteUserForm from '../auth/DeleteUserForm/DeleteUserForm'

const ProgilePage = () => {
  const email = useAppSelector((state) => state.user.email)
  const token = useAppSelector((state) => state.user.token)
  const [openEmailForm, setOpenEmailForm] = useState(false)
  const [openPasswordForm, setOpenPasswordForm] = useState(false)
  const [openDeleteForm, setOpenDeleteForm] = useState(false)

  const changeEmailHandler = () => {
    setOpenEmailForm((prev) => !prev)
    setOpenPasswordForm(false)
    setOpenDeleteForm(false)
  }

  const changePasswordHandler = () => {
    setOpenPasswordForm((prev) => !prev)
    setOpenEmailForm(false)
    setOpenDeleteForm(false)
  }

  const deleteUserHandler = () => {
    setOpenDeleteForm((prev) => !prev)
    setOpenEmailForm(false)
    setOpenPasswordForm(false)
  }

  return (
    <Fragment>
      <h1>Profile</h1>
      <div>
        <p>email: {email}</p>
        <button onClick={changeEmailHandler}>Change email</button>
        <button onClick={changePasswordHandler}>Change password</button>
        <button onClick={deleteUserHandler}>Delete user</button>
      </div>
      {openEmailForm && <ChangeCredentialsForm fieldName="email" token={token!} onEdit={() => setOpenEmailForm(false)} />}
      {openPasswordForm && <ChangeCredentialsForm fieldName="password" token={token!} onEdit={() => setOpenPasswordForm(false)} />}
      {openDeleteForm && <DeleteUserForm token={token!} />}
    </Fragment>
  )
}

export default ProgilePage
