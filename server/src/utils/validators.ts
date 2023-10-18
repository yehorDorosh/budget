import { body, oneOf } from 'express-validator'

import { BudgetDataSource } from '../db/data-source'
import { User } from '../models/user'
import { Category } from '../models/category'
import { CategoryType } from '../types/enums'

export const emailValidator = (fieldName: string = 'email', checkIsExisted: boolean = true, checkOnlyIfFieldHasValue = false) => {
  return body(fieldName)
    .trim()
    .if((value) => !!value || !checkOnlyIfFieldHasValue)
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

export const passwordValidator = (fieldName: string = 'password', checkOnlyIfFieldHasValue = false) => {
  return body(fieldName)
    .trim()
    .if((value) => !!value || !checkOnlyIfFieldHasValue)
    .isStrongPassword({ minSymbols: 0 })
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
    .custom((value, { req }) => {
      const user = req.user!
      const categoryType = req.body.categoryType
      if (!Object.values(CategoryType).includes(categoryType)) {
        return Promise.reject('Invalid categoryType')
      }

      return BudgetDataSource.manager
        .findOne(Category, { where: { name: value, user: { id: user.id }, categoryType } })
        .then((category) => {
          if (category) {
            return Promise.reject('Category with this name already exists!')
          }
        })
    })
}

export const categoryTypeValidator = (fieldName: string = 'categoryType') => {
  return body(fieldName)
    .trim()
    .custom((value) => {
      if (!Object.values(CategoryType).includes(value)) {
        return Promise.reject('Invalid categoryType')
      }
      return true
    })
}
