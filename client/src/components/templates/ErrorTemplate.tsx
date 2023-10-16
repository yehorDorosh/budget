import React, { FC, Fragment } from 'react'
import PageHeader from '../layout/PageHeader/PageHeader'

interface Props {
  children?: React.ReactNode
}

const ErrorTemplate: FC<Props> = ({ children }) => {
  return (
    <Fragment>
      <PageHeader />
      <main data-testid="main">
        <div className="content" data-testid="content">
          {children}
        </div>
      </main>
    </Fragment>
  )
}

export default ErrorTemplate
