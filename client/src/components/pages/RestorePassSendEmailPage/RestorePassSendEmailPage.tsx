import { Fragment, useState } from 'react'

import RestorePassSendEmailForm from '../../auth/RestorePassSendEmailForm/RestorePassSendEmailForm'

const RestorePassSendEmailPage = () => {
  const [email, setEmail] = useState<string | undefined>()

  const sendEmailHandler = (email: string) => {
    setEmail(email)
  }

  return (
    <Fragment>
      <h1>Restore password</h1>
      {email ? (
        <p data-testid="msg">The email with instructions on how to reset your password was sent to the email address {email}</p>
      ) : (
        <RestorePassSendEmailForm onSendEmail={sendEmailHandler} />
      )}
    </Fragment>
  )
}

export default RestorePassSendEmailPage
