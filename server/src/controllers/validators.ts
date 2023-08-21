import { body } from 'express-validator'
import { BudgetDataSource } from '../db/data-source'

import { User } from '../models/user'

export const emailValidator = (fieldName: string = 'email', checkIsExisted: boolean = true) => {
  return body(fieldName)
    .trim()
    .normalizeEmail({ gmail_remove_dots: false })
    .isEmail()
    .custom((value) => {
      if (!checkIsExisted) return true
      return BudgetDataSource.manager.findOneBy(User, { email: value }).then((user) => {
        if (user) {
          return Promise.reject('E-mail address already exists!')
        }
      })
    })
}

export const passwordValidator = (fieldName: string = 'password') => {
  return body(fieldName).trim().isLength({ min: 6 })
}
