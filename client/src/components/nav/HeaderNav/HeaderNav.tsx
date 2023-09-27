import { Fragment, FC } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../../hooks/useReduxTS'

import classes from './HeaderNav.module.scss'
import { userActions } from '../../../store/user/user-slice'

interface Props {
  isOpen: boolean
  onClick: () => void
}

const HeaderNav: FC<Props> = ({ isOpen, onClick }) => {
  const isLogin = useAppSelector((state) => state.user.isLogin)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const logoutHandler = () => {
    dispatch(userActions.logout())
    navigate('/', { replace: true })
  }

  return (
    <nav className={`${classes.nav} ${isOpen ? classes.open : ''}`} onClick={() => onClick()}>
      <ul>
        {isLogin ? (
          <Fragment>
            <li>
              <NavLink to="/budget" end>
                Budget
              </NavLink>
            </li>
            <li>
              <NavLink to="/budget/categories">Categories</NavLink>
            </li>
            <li>
              <NavLink to="/weather">Weather</NavLink>
            </li>
            <li>
              <NavLink to="/profile">Profile</NavLink>
            </li>
            <li>
              <button className="btn btn-primary" onClick={logoutHandler}>
                Log Out
              </button>
            </li>
          </Fragment>
        ) : (
          <Fragment>
            <li>
              <NavLink to="/signup">Sign Up</NavLink>
            </li>
            <li>
              <NavLink to="/login">Log In</NavLink>
            </li>
          </Fragment>
        )}
      </ul>
    </nav>
  )
}

export default HeaderNav
