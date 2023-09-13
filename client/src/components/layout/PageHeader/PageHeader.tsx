import { NavLink } from 'react-router-dom'

import classes from './PageHeader.module.scss'

import HeaderNav from '../../nav/HeaderNav/HeaderNav'

const PageHeader = () => {
  return (
    <header className={classes.header}>
      <NavLink to="/">
        <img className={classes.logo} src="/logo192.png" alt="site logo" />
      </NavLink>
      <HeaderNav />
    </header>
  )
}

export default PageHeader
