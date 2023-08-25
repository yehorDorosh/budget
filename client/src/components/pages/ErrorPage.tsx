import React, { FC } from 'react'
import { useLocation } from 'react-router-dom'

import { ActionResult, determineAxiosErrorPayload } from '../../types/actions/actions'
import ErrorTemplate from '../templates/ErrorTemplate'

interface Props {
  message?: string
  routerError?: { statusText: string; status: number }
}

const ErrorPage: FC<Props> = ({ message, routerError }) => {
  const location = useLocation()
  const dataFromAction = location.state.data as ActionResult<unknown>
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
        {determineAxiosErrorPayload(dataFromAction) && <i>{dataFromAction.errorMsg}</i>}
      </p>
      {determineAxiosErrorPayload(dataFromAction) && dataFromAction.data.validationErrors?.length && (
        <ul>
          {dataFromAction.data.validationErrors.map((item, i) => {
            return <li key={i}>{item.msg}</li>
          })}
        </ul>
      )}
    </ErrorTemplate>
  )
}

export default ErrorPage
