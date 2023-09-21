import express from 'express'

import { notEmptyValidator, categoryValidator, categoryTypeValidator } from '../utils/validators'

import { addCategory, updateCategory, deleteCategory, getCategories } from '../controllers/categories'
import auth from '../middleware/auth'
import { validationErrorsHandler } from '../utils/errors'

const router = express.Router()

router.post(
  '/add-category',
  auth,
  [notEmptyValidator('name'), categoryValidator(), categoryTypeValidator()],
  validationErrorsHandler('Add Category validation failed.'),
  addCategory
)

router.get('/get-categories', auth, getCategories)

router.delete('/delete-category', auth, deleteCategory)

router.put(
  '/update-category',
  auth,
  [notEmptyValidator('name'), notEmptyValidator('id'), categoryValidator(), categoryTypeValidator()],
  validationErrorsHandler('Update category validation failed.'),
  updateCategory
)

export default router
