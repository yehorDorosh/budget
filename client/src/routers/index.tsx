import { createBrowserRouter } from 'react-router-dom'

import DefaultTemplate from '../components/templates/DefaultTemplate'
import SignupPage from '../components/pages/SignupPage'
import LoginPage from '../components/pages/LoginPage/LoginPage'
import HomePage from '../components/pages/HomePage/HomePage'
import RouterErrorBoundary from '../components/errors/RouterErrorBoundary'
import ErrorPage from '../components/pages/ErrorPage/ErrorPage'
import RestorePassSendEmailPage from '../components/pages/RestorePassSendEmailPage/RestorePassSendEmailPage'
import RestorePassPage from '../components/pages/RestorePassPage/RestorePassPage'
import ProfilePage from '../components/pages/ProfilePage/ProfilePage'
import RequireAuth from '../components/auth/RequireAuth/RequireAuth'
import BudgetPage from '../components/pages/BudgetPage/BudgetPage'
import CategoriesPage from '../components/pages/CategoriesPage/CategoriesPage'
import WeatherPage from '../components/pages/WeatherPage'

export const routesConfig = [
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
      },
      {
        path: '/weather',
        element: (
          <RequireAuth>
            <WeatherPage />
          </RequireAuth>
        )
      }
    ]
  },
  {
    path: '/500',
    element: <ErrorPage />
  },
  {
    path: '/400',
    element: <ErrorPage />
  }
]

const router = createBrowserRouter(routesConfig)

export default router
