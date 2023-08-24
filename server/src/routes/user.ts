import express from 'express'

import { emailValidator, passwordValidator } from '../utils/validators'

import { login, signup, sendRestorePasswordEmail, restorePassword } from '../controllers/user'
import { validationErrorsHandler } from '../utils/errors'

const router = express.Router()

router.post('/signup', [emailValidator(), passwordValidator()], validationErrorsHandler('SignUp validation failed'), signup)

router.post('/login', login)

router.post('/restore-password', sendRestorePasswordEmail)
router.post(
  '/restore-password/:token',
  passwordValidator('newPassword'),
  validationErrorsHandler('Restore password validation failed'),
  restorePassword
)

export default router
