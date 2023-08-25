import { NavLink } from 'react-router-dom'

import classes from './HeaderNav.module.scss'

const HeaderNav = () => {
  return (
    <nav className={classes.nav}>
      <ul>
        <li>
          <NavLink to="/signup">Sign Up</NavLink>
        </li>
        <li>
          <NavLink to="/login">Log In</NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default HeaderNav
