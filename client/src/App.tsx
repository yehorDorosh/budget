import { RouterProvider } from 'react-router-dom'
import router from './routers'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './hooks/useReduxTS'

import ErrorBoundary from './components/errors/ErrorBoundary'
import { loginAndAutoLogout, getUserData } from './store/user/user-actions'

function App() {
  const dispatch = useAppDispatch()
  const { isLogin, token: storeToken } = useAppSelector((state) => state.user)

  useEffect(() => {
    if (!isLogin) {
      const token = storeToken || localStorage.getItem('token')
      if (token) {
        dispatch(getUserData(token))
        loginAndAutoLogout(token, dispatch)
      }
    }
  }, [isLogin, storeToken, dispatch])
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}

export default App
