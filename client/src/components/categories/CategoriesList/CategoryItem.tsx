import React, { FC, Fragment, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxTS'
import { deleteCategory } from '../../../store/categories/categories-actions'
import BaseModal from '../../ui/BaseModal/BaseModal'
import UpdateCategoryForm from '../UpdateCategoryForm/UpdateCategoryForm'

interface Props {
  id: number
  value: string
}

const ListItem: FC<Props> = ({ id, value }) => {
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.user.token)
  const [openForm, setOpenForm] = useState(false)

  const deleteHandler = () => {
    dispatch(deleteCategory(token, id))
  }

  const editBtnHandler = () => {
    setOpenForm(true)
  }

  return (
    <Fragment>
      <BaseModal isOpen={openForm} onClose={() => setOpenForm(false)}>
        <UpdateCategoryForm id={id} token={token!} defaultName={value} onSave={() => setOpenForm(false)} />
      </BaseModal>
      <tr>
        <td>{value}</td>
        <td>
          <button onClick={editBtnHandler}>Edit</button>
          <button onClick={deleteHandler}>Delete</button>
        </td>
      </tr>
    </Fragment>
  )
}

export default ListItem
