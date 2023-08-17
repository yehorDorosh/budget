import express from 'express'

import { emailValidator, passwordValidator } from '../controllers/validators'

import { signup } from '../controllers/user'

const router = express.Router()

router.post('/signup', [emailValidator(), passwordValidator()], signup)

export default router
