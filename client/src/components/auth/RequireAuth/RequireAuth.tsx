import React, { FC, Fragment, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../../hooks/useReduxTS'
import { loginAndAutoLogout } from '../../../store/user/user-actions'

interface Props {
  children: React.ReactNode
}

const RequireAuth: FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLogin, token: storeToken } = useAppSelector((state) => state.user)

  useEffect(() => {
    if (!isLogin) {
      const token = storeToken || localStorage.getItem('token')
      if (token) {
        dispatch(loginAndAutoLogout(token))
      } else {
        navigate('/login', { replace: true })
      }
    }
  }, [isLogin, storeToken, dispatch, navigate])

  return <Fragment>{children}</Fragment>
}

export default RequireAuth
