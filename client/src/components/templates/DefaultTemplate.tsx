import React, { FC } from 'react'
import PageHeader from '../layout/PageHeader'
import { Outlet } from 'react-router-dom'

const DefaultTemplate: FC = () => {
  return (
    <main>
      <PageHeader />
      <div className="content">
        <Outlet />
      </div>
    </main>
  )
}

export default DefaultTemplate
