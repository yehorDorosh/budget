import express from 'express'

import { emailValidator, passwordValidator } from '../controllers/validators'

import { signup } from '../controllers/user'
import { validationErrorsHandler } from '../utils/errors'

const router = express.Router()

router.post('/signup', [emailValidator(), passwordValidator()], validationErrorsHandler('SignUp validation failed'), signup)

export default router
