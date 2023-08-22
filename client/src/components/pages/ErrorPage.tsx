import { Fragment } from 'react'
import { useRouteError } from 'react-router-dom'

const ErrorPage = () => {
  const error = useRouteError()
  // console.error(error)
  const message = (error as Error)?.message
  const routerError = error as { statusText: string; status: number }
  return (
    <Fragment>
      <h1>Error.</h1>
      {routerError.status === 404 ? (
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
    </Fragment>
  )
}

export default ErrorPage
