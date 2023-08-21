import { NavLink } from "react-router-dom"
import HeaderNav from "../nav/HeaderNav"

const PageHeader = () => {
  return (
    <header>
      <NavLink to="/">Logo</NavLink>
      <HeaderNav />
    </header>
  )
}

export default PageHeader