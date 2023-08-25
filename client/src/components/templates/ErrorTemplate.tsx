import React, { FC } from 'react'
import PageHeader from '../layout/PageHeader'
import ErrorBoundary from '../errors/ErrorBoundary'

interface Props {
  children?: React.ReactNode
}

const DefaultTemplate: FC<Props> = ({ children }) => {
  return (
    <main>
      <PageHeader />
      <div className="content">{children}</div>
    </main>
  )
}

export default DefaultTemplate
