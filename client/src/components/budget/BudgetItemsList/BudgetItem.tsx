import React, { FC, Fragment, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxTS'
import BaseModal from '../../ui/BaseModal/BaseModal'
import UpdateBudgetItemForm from '../UpdateBudgetItemForm/UpdateBudgetItemForm'
import { BudgetItem } from '../../../store/budget/budget-item-slice'
import { deleteBudgetItem } from '../../../store/budget/budget-item-actions'

import classes from './BudgetItemsList.module.scss'

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
        <td>{budgetItem.value}</td>
        <td>{budgetItem.userDate}</td>
        <td>{budgetItem.category.name}</td>
        <td>{budgetItem.category.categoryType}</td>
        <td>
          <button onClick={editBtnHandler}>Edit</button>
          <button onClick={deleteHandler}>Delete</button>
        </td>
      </tr>
    </Fragment>
  )
}

export default ListItem
