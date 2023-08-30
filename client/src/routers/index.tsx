import { createBrowserRouter } from 'react-router-dom'

import DefaultTemplate from '../components/templates/DefaultTemplate'
import SignupPage from '../components/pages/SignupPage'
import LoginPage from '../components/pages/LoginPage'
import HomePage from '../components/pages/HomePage'
import RouterErrorBoundary from '../components/errors/RouterErrorBoundary'
import ErrorPage from '../components/pages/ErrorPage'
import RestorePassSendEmailPage from '../components/pages/RestorePassSendEmailPage'
import RestorePassPage from '../components/pages/RestorePassPage'
import ProfilePage from '../components/pages/ProfilePage'
import RequireAuth from '../components/auth/RequireAuth/RequireAuth'
import BudgetPage from '../components/pages/BudgetPage'
import CategoriesPage from '../components/pages/CategoriesPage'

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
      },
      {
        path: '/profile',
        element: (
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        )
      },
      {
        path: '/budget',
        element: (
          <RequireAuth>
            <BudgetPage />
          </RequireAuth>
        )
      },
      {
        path: '/budget/categories',
        element: (
          <RequireAuth>
            <CategoriesPage />
          </RequireAuth>
        )
      }
    ]
  },
  {
    path: '/500',
    element: <ErrorPage />
  }
])

export default router
