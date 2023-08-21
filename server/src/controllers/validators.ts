import { body } from 'express-validator'
import { BudgetDataSource } from '../db/data-source'

import { User } from '../models/user'

export const emailValidator = () => {
  return body('email')
    .trim()
    .normalizeEmail({ gmail_remove_dots: false })
    .isEmail()
    .custom((value) => {
      return BudgetDataSource.manager.findOneBy(User, { email: value }).then((user) => {
        if (user) {
          return Promise.reject('E-mail address already exists!')
        }
      })
    })
}

export const passwordValidator = () => {
  return body('password').trim().isLength({ min: 6 })
}
