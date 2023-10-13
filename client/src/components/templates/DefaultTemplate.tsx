import React, { FC, Fragment } from 'react'
import PageHeader from '../layout/PageHeader/PageHeader'
import { Outlet } from 'react-router-dom'

const DefaultTemplate: FC = () => {
  return (
    <Fragment>
      <PageHeader />
      <main className="py-4" data-testid="main">
        <div className="container" data-testid="content">
          <Outlet />
        </div>
      </main>
    </Fragment>
  )
}

export default DefaultTemplate
