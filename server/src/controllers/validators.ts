import { body } from 'express-validator'
import { BudgetDataSource } from '../db/data-source'

import { Users } from '../models/users'

export const emailValidator = () => {
  return body('email')
    .trim()
    .normalizeEmail({ gmail_remove_dots: false })
    .isEmail()
    .custom((value) => {
      return BudgetDataSource.manager.findOneBy(Users, { email: value }).then((user) => {
        if (user) {
          return Promise.reject('E-mail address already exists!')
        }
      })
    })
}

export const passwordValidator = () => {
  return body('password').trim().isLength({ min: 6 }).isAlphanumeric()
}
