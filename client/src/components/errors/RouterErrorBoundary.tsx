import { useRouteError } from 'react-router-dom'

import ErrorPage from '../pages/ErrorPage'

const RouterErrorBoundary = () => {
  const error = useRouteError()
  // console.error(error)
  const message = (error as Error)?.message
  const routerError = error as { statusText: string; status: number }
  return <ErrorPage message={message} routerError={routerError} />
}

export default RouterErrorBoundary
