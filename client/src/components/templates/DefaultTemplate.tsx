import PageHeader from '../layout/PageHeader'
import { Outlet } from 'react-router-dom'
import ErrorBoundary from '../ErrorBoundary'

const DefaultTemplate = () => {
  return (
    <main>
      <PageHeader />
      <div className="content">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </div>
    </main>
  )
}

export default DefaultTemplate
