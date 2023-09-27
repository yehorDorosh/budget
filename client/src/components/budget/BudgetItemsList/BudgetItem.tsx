import React, { FC, Fragment, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxTS'

import BaseModal from '../../ui/BaseModal/BaseModal'
import UpdateBudgetItemForm from '../UpdateBudgetItemForm/UpdateBudgetItemForm'
import { BudgetItem } from '../../../store/budget/budget-item-slice'
import { deleteBudgetItem } from '../../../store/budget/budget-item-actions'
import { CategoryType } from '../../../types/enum'
import BaseCard from '../../ui/BaseCard/BaseCard'

import classes from './BudgetItem.module.scss'

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

  const itemStyle = () => {
    if (budgetItem.ignore === true) return 'text-bg-secondary'
    if (budgetItem.category.categoryType === CategoryType.INCOME) return 'text-bg-light'
    return 'text-bg-success'
  }

  return (
    <Fragment>
      <BaseModal isOpen={openForm} onClose={() => setOpenForm(false)} title="Edit">
        <UpdateBudgetItemForm token={token} currentBudgetItem={budgetItem} onSave={() => setOpenForm(false)} />
      </BaseModal>
      <BaseCard className={`my-3 ${itemStyle()}`}>
        <div className={classes.row}>
          <div className={`${classes.name}`}>{budgetItem.name}</div>
          <div className={`${classes.data}`}>
            <div className={classes.dataItem}>{budgetItem.value}</div>
            <div className={classes.dataItem}>{budgetItem.userDate}</div>
            <div className={classes.dataItem}>{budgetItem.category.name}</div>
            <div className={classes.dataItem}>{budgetItem.category.categoryType === CategoryType.EXPENSE ? 'E' : 'I'}</div>
          </div>
          <div className={classes.btns}>
            <button className="btn btn-warning me-3" onClick={editBtnHandler}>
              Edit
            </button>
            <button className="btn btn-danger" onClick={deleteHandler}>
              Delete
            </button>
          </div>
        </div>
      </BaseCard>
    </Fragment>
  )
}

export default ListItem
