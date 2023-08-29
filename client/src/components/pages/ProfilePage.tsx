import React, { Fragment } from 'react'
import { useAppSelector } from '../../hooks/useReduxTS'

const ProgilePage = () => {
  const email = useAppSelector((state) => state.user.email)
  return (
    <Fragment>
      <h1>Profile</h1>
      <ul>
        <li>email: {email}</li>
      </ul>
    </Fragment>
  )
}

export default ProgilePage
