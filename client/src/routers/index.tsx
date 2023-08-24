import { createBrowserRouter } from 'react-router-dom'

import DefaultTemplate from '../components/templates/DefaultTemplate'
import SignupPage from '../components/pages/SignupPage'
import LoginPage from '../components/pages/LoginPage'
import HomePage from '../components/pages/HomePage'
import RouterErrorBoundary from '../components/errors/RouterErrorBoundary'
import RestorePassSendEmailPage from '../components/pages/RestorePassSendEmailPage'
import RestorePassPage from '../components/pages/RestorePassPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultTemplate />,
    errorElement: <RouterErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: '/signup',
        element: <SignupPage />
      },
      {
        path: '/login',
        element: <LoginPage />
      },
      {
        path: '/restore-password',
        element: <RestorePassSendEmailPage />
      },
      {
        path: '/restore-password/:token',
        element: <RestorePassPage />
      }
    ]
  }
])

export default router
