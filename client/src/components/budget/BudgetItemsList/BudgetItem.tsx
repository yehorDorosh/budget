import React, { FC, Fragment, useState } from 'react'
import { useAppDispatch } from '../../../hooks/useReduxTS'

import BaseModal from '../../ui/BaseModal/BaseModal'
import UpdateBudgetItemForm from '../UpdateBudgetItemForm/UpdateBudgetItemForm'
import { BudgetItem } from '../../../store/budget/budget-item-slice'
import { deleteBudgetItem } from '../../../store/budget/budget-item-actions'
import { CategoryType, ResCodes } from '../../../types/enum'
import BaseCard from '../../ui/BaseCard/BaseCard'

import classes from './BudgetItem.module.scss'
import { isActionPayload } from '../../../types/store-actions'

interface Props {
  token: string
  budgetItem: BudgetItem
  onChange: (budgetItem: BudgetItem) => void
  onDelete: (id: number) => void
}

const ListItem: FC<Props> = ({ budgetItem, token, onChange, onDelete }) => {
  const dispatch = useAppDispatch()
  const [openForm, setOpenForm] = useState(false)

  const deleteHandler = async () => {
    const res = await dispatch(deleteBudgetItem({ token, id: budgetItem.id }))

    if (isActionPayload(res) && res.data.code === ResCodes.DELETE_BUDGET_ITEM) {
      onDelete(budgetItem.id)
    }
  }

  const editBtnHandler = () => {
    setOpenForm(true)
  }

  const onEditHandler = (budgetItem: BudgetItem) => {
    setOpenForm(false)
    onChange(budgetItem)
  }

  const itemStyle = () => {
    if (budgetItem.ignore === true) return 'text-bg-secondary'
    if (budgetItem.category.categoryType === CategoryType.INCOME) return 'text-bg-light'
    return 'text-bg-success'
  }

  return (
    <Fragment>
      <BaseModal isOpen={openForm} onClose={() => setOpenForm(false)} title="Edit">
        <UpdateBudgetItemForm token={token} currentBudgetItem={budgetItem} onSave={onEditHandler} />
      </BaseModal>
      <BaseCard className={`my-3 ${itemStyle()}`} data-testid="budget-item">
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
