import React, { FC } from 'react'
import PageHeader from '../layout/PageHeader'

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
