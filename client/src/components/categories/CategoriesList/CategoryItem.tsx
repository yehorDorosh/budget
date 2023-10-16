import React, { FC, Fragment, useState } from 'react'
import { useAppDispatch } from '../../../hooks/useReduxTS'
import { deleteCategory } from '../../../store/categories/categories-actions'
import BaseModal from '../../ui/BaseModal/BaseModal'
import UpdateCategoryForm from '../UpdateCategoryForm/UpdateCategoryForm'
import { CategoryType } from '../../../types/enum'
import BaseCard from '../../ui/BaseCard/BaseCard'

import classes from './CategoryItem.module.scss'

interface Props {
  id: number
  value: string
  categoryType: CategoryType
  token: string
}

const ListItem: FC<Props> = ({ id, value, categoryType, token }) => {
  const dispatch = useAppDispatch()
  const [openForm, setOpenForm] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const deleteHandler = () => {
    dispatch(deleteCategory({ token, id }))
  }

  const editBtnHandler = () => {
    setOpenForm(true)
  }

  return (
    <Fragment>
      <BaseModal isOpen={openForm} onClose={() => setOpenForm(false)} title="Edit">
        <UpdateCategoryForm
          id={id}
          token={token!}
          defaultName={value}
          defaultCategoryType={categoryType}
          onSave={() => setOpenForm(false)}
        />
      </BaseModal>
      <BaseModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        title="Delete Category"
        footer={{
          reject: { text: 'Cancel', onClick: () => setOpenDeleteModal(false) },
          accept: { text: 'Delete', onClick: deleteHandler }
        }}
      >
        <p>Are you sure you want to delete this category?</p>
        <p>All budget items in this category also will be deleted!</p>
      </BaseModal>
      <BaseCard
        className={`my-3 ${categoryType === CategoryType.EXPENSE ? 'text-bg-dark' : 'text-bg-success'}`}
        data-testid="category-item"
      >
        <div className={classes.row}>
          <div>{value}</div>
          <div className="px-3">{categoryType}</div>
          <div className={classes.btns}>
            <button className="btn btn-warning me-3 my-1" onClick={editBtnHandler}>
              Edit
            </button>
            <button className="btn btn-danger my-1" onClick={() => setOpenDeleteModal(true)}>
              Delete
            </button>
          </div>
        </div>
      </BaseCard>
    </Fragment>
  )
}

export default ListItem
