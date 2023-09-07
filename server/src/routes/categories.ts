import express from 'express'

import { notEmptyValidator, categoryValidator } from '../utils/validators'

import { addCategory, updateCategory, deleteCategory, getCategories } from '../controllers/categories'
import auth from '../middleware/auth'
import { validationErrorsHandler } from '../utils/errors'

const router = express.Router()

router.post(
  '/add-category',
  [notEmptyValidator('name'), categoryValidator()],
  validationErrorsHandler('Categories validation failed'),
  auth,
  addCategory
)

router.get('/get-categories', auth, getCategories)

router.delete('/delete-category', auth, deleteCategory)

router.put(
  '/update-category',
  [notEmptyValidator('name'), notEmptyValidator('categoryType')],
  validationErrorsHandler('Categories validation failed'),
  auth,
  updateCategory
)

export default router
