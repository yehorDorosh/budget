import express from 'express'

import { emailValidator, passwordValidator } from '../utils/validators'

import { login, signup, sendRestorePasswordEmail, restorePassword, getUserInfo } from '../controllers/user'
import auth from '../middleware/auth'
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

router.get('/get-user', auth, getUserInfo)

export default router
