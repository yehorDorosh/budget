import { RouterProvider } from 'react-router-dom'
import router from './routers'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './hooks/useReduxTS'

import * as jose from 'jose'

import ErrorBoundary from './components/errors/ErrorBoundary'
import { userActions } from './store/user/user-slice'
import { getUserData } from './store/user/user-actions'

function App() {
  const dispatch = useAppDispatch()
  const { isLogin, token: storeToken } = useAppSelector((state) => state.user)

  useEffect(() => {
    if (!isLogin) {
      const token = storeToken || localStorage.getItem('token')
      if (token) {
        const { exp: expiryDate } = jose.decodeJwt(token)
        if (expiryDate && Date.now() >= expiryDate * 1000) {
          dispatch(userActions.logout())
        } else {
          dispatch(getUserData(token))
        }
      } else {
        dispatch(userActions.logout())
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
