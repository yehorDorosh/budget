import { Fragment, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../hooks/useReduxTS'
import AddBudgetItemForm from '../budget/AddBudgetItemForm/AddBudgetItemForm'
import { getCategories } from '../../store/categories/categories-actions'

const HomePage = () => {
  const dispatch = useAppDispatch()
  const isLogin = useAppSelector((state) => state.user.isLogin)
  const token = useAppSelector((state) => state.user.token)

  useEffect(() => {
    if (token) {
      dispatch(getCategories({ token }))
    }
  }, [token, dispatch])

  return (
    <Fragment>
      <h1>Home Page</h1>
      {isLogin && token && <AddBudgetItemForm token={token} />}
    </Fragment>
  )
}

export default HomePage
