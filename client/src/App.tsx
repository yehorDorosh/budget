import { RouterProvider } from 'react-router-dom'
import router from './routers'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './hooks/useReduxTS'

import ErrorBoundary from './components/errors/ErrorBoundary'
import { loginAndAutoLogout, getUserData } from './store/user/user-actions'
import { userActions } from './store/user/user-slice'
import { isActionPayload } from './types/store-actions'

function App() {
  const dispatch = useAppDispatch()
  const { isLogin, token: storeToken } = useAppSelector((state) => state.user)

  useEffect(() => {
    const loginOnFirstLoad = async () => {
      if (!isLogin) {
        const token = storeToken || localStorage.getItem('token')
        if (token) {
          const res = await dispatch(getUserData({ token }))
          if (isActionPayload(res) && res.status === 200) {
            dispatch(loginAndAutoLogout({ token }))
          } else {
            dispatch(userActions.logout())
          }
        }
      }
    }

    loginOnFirstLoad()
  }, [isLogin, storeToken, dispatch])
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}

export default App
