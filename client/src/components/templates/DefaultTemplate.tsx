import PageHeader from '../layout/PageHeader'
import { Outlet } from 'react-router-dom'

const DefaultTemplate = () => {
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
