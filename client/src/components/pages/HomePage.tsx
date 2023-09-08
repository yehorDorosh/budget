import { Fragment } from 'react'
import { useAppSelector } from '../../hooks/useReduxTS'
import AddBudgetItemForm from '../budget/AddBudgetItemForm/AddBudgetItemForm'

const HomePage = () => {
  const isLogin = useAppSelector((state) => state.user.isLogin)
  const token = useAppSelector((state) => state.user.token)

  return (
    <Fragment>
      <h1>Home Page</h1>
      {isLogin && token && <AddBudgetItemForm token={token} />}
    </Fragment>
  )
}

export default HomePage
