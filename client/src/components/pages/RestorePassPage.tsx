import { Fragment } from 'react'
import { useParams } from 'react-router-dom'

import RestorePassForm from '../auth/RestorePassForm'

const RestorePassPage = () => {
  const { token } = useParams()
  if (!token) {
    const err = new Error('Invalid restore token')
    console.error(err)
    throw err
  }
  return (
    <Fragment>
      <h1>Enter new password</h1>
      <RestorePassForm token={token} />
    </Fragment>
  )
}

export default RestorePassPage
