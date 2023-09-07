import React, { FC, Fragment, useState } from 'react'
import { useAppDispatch } from '../../../hooks/useReduxTS'
import { deleteCategory } from '../../../store/categories/categories-actions'
import BaseModal from '../../ui/BaseModal/BaseModal'
import UpdateCategoryForm from '../UpdateCategoryForm/UpdateCategoryForm'
import { CategoryType } from '../../../types/enum'

interface Props {
  id: number
  value: string
  categoryType: CategoryType
  token: string
}

const ListItem: FC<Props> = ({ id, value, categoryType, token }) => {
  const dispatch = useAppDispatch()
  const [openForm, setOpenForm] = useState(false)

  const deleteHandler = () => {
    dispatch(deleteCategory({ token, id }))
  }

  const editBtnHandler = () => {
    setOpenForm(true)
  }

  return (
    <Fragment>
      <BaseModal isOpen={openForm} onClose={() => setOpenForm(false)}>
        <UpdateCategoryForm
          id={id}
          token={token!}
          defaultName={value}
          defaultCategoryType={categoryType}
          onSave={() => setOpenForm(false)}
        />
      </BaseModal>
      <tr>
        <td>{value}</td>
        <td>{categoryType}</td>
        <td>
          <button onClick={editBtnHandler}>Edit</button>
          <button onClick={deleteHandler}>Delete</button>
        </td>
      </tr>
    </Fragment>
  )
}

export default ListItem
