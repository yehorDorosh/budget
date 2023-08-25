import { NavLink } from 'react-router-dom'

import classes from './PageHeader.module.scss'

import HeaderNav from '../../nav/HeaderNav/HeaderNav'

const PageHeader = () => {
  return (
    <header className={classes.header}>
      <NavLink to="/">Logo</NavLink>
      <HeaderNav />
    </header>
  )
}

export default PageHeader
