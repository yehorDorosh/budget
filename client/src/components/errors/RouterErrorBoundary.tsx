import { useRouteError } from 'react-router-dom'

import ErrorPage from '../pages/ErrorPage/ErrorPage'

const RouterErrorBoundary = () => {
  const error = useRouteError()
  const message = (error as Error)?.message
  const routerError = error as { statusText: string; status: number }
  return <ErrorPage message={message} routerError={routerError} />
}

export default RouterErrorBoundary
