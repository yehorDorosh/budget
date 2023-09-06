import { Fragment, useEffect } from 'react'
import AddCategoryForm from '../categories/AddCategoryForm/AddCategoryForm'
import { useAppSelector } from '../../hooks/useReduxTS'
import CategoriesList from '../categories/CategoriesList/CategoriesList'
import { getCategories } from '../../store/categories/categories-actions'
import { useAppDispatch } from '../../hooks/useReduxTS'

const CategoriesPage = () => {
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.user.token)

  useEffect(() => {
    if (token) {
      dispatch(getCategories({ token }))
    }
  }, [token, dispatch])

  return (
    <Fragment>
      <h1>Categories</h1>
      <p>Add new category:</p>
      <AddCategoryForm token={token!} />
      <CategoriesList token={token!} />
    </Fragment>
  )
}

export default CategoriesPage
