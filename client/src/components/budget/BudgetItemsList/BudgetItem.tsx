import React, { FC, Fragment, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxTS'
import BaseModal from '../../ui/BaseModal/BaseModal'
import UpdateBudgetItemForm from '../UpdateBudgetItemForm/UpdateBudgetItemForm'
import { BudgetItem } from '../../../store/budget/budget-item-slice'
import { deleteBudgetItem } from '../../../store/budget/budget-item-actions'

import classes from './BudgetItemsList.module.scss'
import { CategoryType } from '../../../types/enum'

interface Props {
  token: string
  budgetItem: BudgetItem
}

const ListItem: FC<Props> = ({ budgetItem, token }) => {
  const dispatch = useAppDispatch()
  const [openForm, setOpenForm] = useState(false)
  const filters = useAppSelector((state) => state.budgetItem.filters)

  const deleteHandler = () => {
    dispatch(deleteBudgetItem({ token, id: budgetItem.id, filters }))
  }

  const editBtnHandler = () => {
    setOpenForm(true)
  }

  return (
    <Fragment>
      <BaseModal isOpen={openForm} onClose={() => setOpenForm(false)}>
        <UpdateBudgetItemForm token={token} currentBudgetItem={budgetItem} onSave={() => setOpenForm(false)} />
      </BaseModal>
      <tr className={budgetItem.ignore === true ? classes.ignore : ''}>
        <td>{budgetItem.name}</td>
        <td className="center">{budgetItem.value}</td>
        <td className="center">{budgetItem.userDate}</td>
        <td className="center">{budgetItem.category.name}</td>
        <td className="center">{budgetItem.category.categoryType === CategoryType.EXPENSE ? 'E' : 'I'}</td>
        <td>
          <button className="btn btn-warning" onClick={editBtnHandler}>
            Edit
          </button>
          <button className="btn btn-danger" onClick={deleteHandler}>
            Delete
          </button>
        </td>
      </tr>
    </Fragment>
  )
}

export default ListItem
