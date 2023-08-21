import { NavLink } from "react-router-dom"

const HeaderNav = () => {
  return (
    <nav>
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