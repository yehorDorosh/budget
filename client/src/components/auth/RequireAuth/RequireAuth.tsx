import React, { FC } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../../../hooks/useReduxTS'

interface Props {
  children: React.ReactNode
}

const RequireAuth: FC<Props> = ({ children }) => {
  const isLogin = useAppSelector((state) => state.user.isLogin)
  if (!isLogin) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default RequireAuth
