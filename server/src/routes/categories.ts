import express from 'express'

import { notEmptyValidator } from '../utils/validators'

import { addCategory } from '../controllers/categories'
import auth from '../middleware/auth'
import { validationErrorsHandler } from '../utils/errors'

const router = express.Router()

router.post('/add', notEmptyValidator('name'), validationErrorsHandler('Categories alidation failed'), auth, addCategory)

export default router
