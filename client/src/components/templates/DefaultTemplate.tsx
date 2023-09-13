import React, { FC, Fragment } from 'react'
import PageHeader from '../layout/PageHeader/PageHeader'
import { Outlet } from 'react-router-dom'

const DefaultTemplate: FC = () => {
  return (
    <Fragment>
      <PageHeader />
      <main>
        <div className="container">
          <Outlet />
        </div>
      </main>
    </Fragment>
  )
}

export default DefaultTemplate
