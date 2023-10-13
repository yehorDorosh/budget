import { Fragment } from 'react'
import { useParams } from 'react-router-dom'

import RestorePassForm from '../../auth/RestorePassForm/RestorePassForm'

const RestorePassPage = () => {
  const { token } = useParams()
  if (!token) {
    throw new Error('Invalid restore token')
  }

  return (
    <Fragment>
      <h1>Enter new password</h1>
      <RestorePassForm token={token} />
    </Fragment>
  )
}

export default RestorePassPage
