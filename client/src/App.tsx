import { RouterProvider } from 'react-router-dom'

import router from './routers'
import ErrorBoundary from './components/errors/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}

export default App
