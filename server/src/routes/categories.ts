import express from 'express'

import { notEmptyValidator } from '../utils/validators'

import { addCategory, updateCategory, deleteCategory, getCategories } from '../controllers/categories'
import auth from '../middleware/auth'
import { validationErrorsHandler } from '../utils/errors'

const router = express.Router()

router.post('/add', notEmptyValidator('name'), validationErrorsHandler('Categories validation failed'), auth, addCategory)

router.get('/get', auth, getCategories)

router.delete('/delete', auth, deleteCategory)

router.put('/update', notEmptyValidator('name'), validationErrorsHandler('Categories validation failed'), auth, updateCategory)

export default router
