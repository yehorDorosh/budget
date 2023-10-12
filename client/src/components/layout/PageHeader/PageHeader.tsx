import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

import classes from './PageHeader.module.scss'

import HeaderNav from '../../nav/HeaderNav/HeaderNav'
import BurgerButton from '../../ui/BurgerButton/BurgerButton'

const PageHeader = () => {
  const [openMenu, setOpenMenu] = useState(false)
  return (
    <header className={classes.header}>
      <NavLink to="/" data-testid="logo">
        <img className={classes.logo} src="/logo192.png" alt="site logo" />
      </NavLink>
      <HeaderNav isOpen={openMenu} onClick={() => setOpenMenu(false)} />
      <BurgerButton id="navBurger" className={classes.burger} onClick={() => setOpenMenu((prev) => !prev)} isOpen={openMenu} />
    </header>
  )
}

export default PageHeader
