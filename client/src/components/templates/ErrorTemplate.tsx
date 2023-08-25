import React, { FC, Fragment } from 'react'
import PageHeader from '../layout/PageHeader/PageHeader'

interface Props {
  children?: React.ReactNode
}

const DefaultTemplate: FC<Props> = ({ children }) => {
  return (
    <Fragment>
      <PageHeader />
      <main>
        <div className="content">{children}</div>
      </main>
    </Fragment>
  )
}

export default DefaultTemplate
