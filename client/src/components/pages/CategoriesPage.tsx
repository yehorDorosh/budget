import { Fragment } from 'react'
import AddCategoryForm from '../categories/AddCategoryForm/AddCategoryForm'
import { useAppSelector } from '../../hooks/useReduxTS'

const CategoriesPage = () => {
  const token = useAppSelector((state) => state.user.token)

  return (
    <Fragment>
      <h1>Categories</h1>
      <p>Add new category:</p>
      <AddCategoryForm token={token!} />
    </Fragment>
  )
}

export default CategoriesPage
