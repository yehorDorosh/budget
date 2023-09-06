import express from 'express'

import { notEmptyValidator } from '../utils/validators'

import { addBudgetItem, getBudgetItems, deleteBudgetItem, updateBudgetItem } from '../controllers/budget-item'
import auth from '../middleware/auth'
import { validationErrorsHandler } from '../utils/errors'

const router = express.Router()

router.post(
  '/add-budget-item',
  [notEmptyValidator('name'), notEmptyValidator('value'), notEmptyValidator('userDate'), notEmptyValidator('categoryId')],
  validationErrorsHandler('Add budget item validation failed'),
  auth,
  addBudgetItem
)

router.get('/get-budget-item', auth, getBudgetItems)

router.delete('/delete-budget-item', auth, deleteBudgetItem)

router.put(
  '/update-budget-item',
  [notEmptyValidator('name'), notEmptyValidator('value'), notEmptyValidator('userDate'), notEmptyValidator('categoryId')],
  validationErrorsHandler('Update budget item validation failed'),
  auth,
  updateBudgetItem
)

export default router
