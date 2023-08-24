import React, { FC } from 'react'

import ErrorTemplate from '../templates/ErrorTemplate'

interface Props {
  message?: string
  routerError?: { statusText: string; status: number }
}

const ErrorPage: FC<Props> = ({ message, routerError }) => {
  return (
    <ErrorTemplate>
      <h1>Error.</h1>
      {routerError && routerError.status === 404 ? (
        <p>Sorry, the page you were looking for could not be found.</p>
      ) : (
        <p>Sorry, an unexpected error has occurred.</p>
      )}
      <p>
        {message && <i>{message}</i>}
        {routerError && (
          <i>
            {routerError.status} {routerError.statusText}
          </i>
        )}
      </p>
    </ErrorTemplate>
  )
}

export default ErrorPage
