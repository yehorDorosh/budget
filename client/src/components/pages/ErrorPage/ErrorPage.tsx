import React, { FC } from 'react'
import { useLocation } from 'react-router-dom'

import { ActionResult, isAxiosErrorPayload, isRegularErrorObject } from '../../../types/store-actions'
import ErrorTemplate from '../../templates/ErrorTemplate'
import ErrorList from '../../ui/ErrorList/ErrorList'

interface Props {
  message?: string
  routerError?: { statusText: string; status: number }
}

const ErrorPage: FC<Props> = ({ message, routerError }) => {
  const location = useLocation()
  const dataFromAction = location.state?.data as ActionResult<unknown>
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
        {isAxiosErrorPayload(dataFromAction) && <i>{dataFromAction.errorMsg}</i>}
        {isRegularErrorObject(dataFromAction) && <i>{dataFromAction.error.message}</i>}
      </p>
      {isAxiosErrorPayload(dataFromAction) && dataFromAction.data.validationErrors?.length && (
        <ErrorList errors={dataFromAction.data.validationErrors} />
      )}
    </ErrorTemplate>
  )
}

export default ErrorPage
