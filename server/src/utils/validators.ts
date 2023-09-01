import { body, oneOf } from 'express-validator'
import { BudgetDataSource } from '../db/data-source'

import { User } from '../models/user'
import { Category } from '../models/category'

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
  return body(fieldName).trim().isStrongPassword({ minSymbols: 0 })
}

export const notEmptyValidator = (fieldName: string = 'password') => {
  return body(fieldName).trim().notEmpty()
}

export const atLeastOneNotEmptyValidator = (...fields: string[]) => {
  return oneOf(
    fields.map((field) => body(field).trim().notEmpty()),
    { message: 'At least one of the fields is required: ' + fields.join(', ') }
  )
}

export const categoryValidator = (fieldName: string = 'name') => {
  return body(fieldName)
    .trim()
    .custom((value) => {
      return BudgetDataSource.manager.findOneBy(Category, { name: value }).then((category) => {
        if (category) {
          return Promise.reject('Category with this name already exists!')
        }
      })
    })
}
