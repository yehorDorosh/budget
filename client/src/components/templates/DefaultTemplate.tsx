import PageHeader from '../layout/PageHeader'
import { Outlet } from 'react-router-dom'

const DefaultTemplate = () => {
  return (
    <main className="main">
      <PageHeader />
      <Outlet />
    </main>
  )
}

export default DefaultTemplate
