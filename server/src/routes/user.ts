import express from 'express'

import { emailValidator, notEmptyValidator, passwordValidator, atLeastOneNotEmptyValidator } from '../utils/validators'

import { login, signup, sendRestorePasswordEmail, restorePassword, getUserInfo, updateUser } from '../controllers/user'
import auth from '../middleware/auth'
import { validationErrorsHandler } from '../utils/errors'

const router = express.Router()

router.post('/signup', [emailValidator(), passwordValidator()], validationErrorsHandler('SignUp validation failed'), signup)

router.post(
  '/login',
  [notEmptyValidator('email'), notEmptyValidator('password')],
  validationErrorsHandler('Login validation failed'),
  login
)

router.post('/restore-password', [notEmptyValidator('email')], sendRestorePasswordEmail)
router.post(
  '/restore-password/:token',
  passwordValidator('newPassword'),
  validationErrorsHandler('Restore password validation failed'),
  restorePassword
)

router.get('/get-user', auth, getUserInfo)

router.post(
  '/update-user',
  auth,
  [atLeastOneNotEmptyValidator('email', 'password')],
  validationErrorsHandler('Update user validation failed'),
  updateUser
)

export default router
