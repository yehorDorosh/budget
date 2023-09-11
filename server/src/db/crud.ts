import { NextFunction } from 'express'

import { BudgetDataSource } from './data-source'
import { User } from '../models/user'
import { errorHandler } from '../utils/errors'
import { Category } from '../models/category'
import { CategoryType, QueryFilter } from '../types/enums'
import { BudgetItem } from '../models/budget-item'

export class UserCRUD {
  static add = async (email: string, password: string, next: NextFunction) => {
    if (!email || !password) {
      errorHandler({ message: 'Invalid search params for addUser(CRUD)', statusCode: 500 }, next)
      return null
    }
    const user = new User()
    user.email = email
    user.password = password
    await BudgetDataSource.manager.save(user)
    return user
  }

  static get = async ({ userId, email }: { userId?: UserId; email?: string }, next: NextFunction) => {
    if (!userId && !email) {
      errorHandler({ message: 'Invalid search params for getUser(CRUD)', statusCode: 500 }, next)
      return null
    }
    const searchParams = userId ? { id: userId } : email ? { email } : {}
    const user = await BudgetDataSource.manager.findOneBy(User, searchParams)
    if (!user) {
      errorHandler({ message: 'User not found', statusCode: 403 }, next)
      return null
    }
    return user
  }

  static delete = async (user: User, next: NextFunction) => {
    if (!user) {
      errorHandler({ message: 'Invalid search params for deleteUser(CRUD)', statusCode: 500 }, next)
      return null
    }
    await BudgetDataSource.manager.remove(user)
    return user
  }

  static update = async (
    user: User,
    { email, password }: { email: string; password?: string } | { email?: string; password: string },
    next: NextFunction
  ) => {
    if (!user || (!email && !password)) {
      errorHandler({ message: 'Invalid search params for updateUser(CRUD)', statusCode: 500 }, next)
      return null
    }
    if (email) user.email = email
    if (password) user.password = password
    await BudgetDataSource.manager.save(user)
    return user
  }
}

export class CategoryCRUD {
  static add = async (user: User, name: string, categoryType: CategoryType, next: NextFunction) => {
    if (!user || !name || !categoryType) {
      errorHandler({ message: 'Invalid search params for addCategory(CRUD)', statusCode: 500 }, next)
      return null
    }
    const category = new Category()
    category.name = name
    category.categoryType = categoryType
    category.user = user
    await BudgetDataSource.manager.save(category)
    return category
  }

  static get = async (userId: UserId, next: NextFunction) => {
    if (!userId) {
      errorHandler({ message: 'Invalid search params for getCategories(CRUD)', statusCode: 500 }, next)
      return null
    }
    const categories = await BudgetDataSource.getRepository(Category).find({
      where: { user: { id: userId } },
      order: { categoryType: 'DESC', name: 'ASC' }
    })
    if (!categories) {
      errorHandler({ message: 'No categories for this user', statusCode: 403 }, next)
      return null
    }
    return categories
  }

  static getById = async (categoryId: number, next: NextFunction) => {
    if (!categoryId) {
      errorHandler({ message: 'Invalid search params for getCategory(CRUD)', statusCode: 500 }, next)
      return null
    }
    const categories = await BudgetDataSource.manager.findOneBy(Category, { id: categoryId })
    if (!categories) {
      errorHandler({ message: 'No categories for this user', statusCode: 403 }, next)
      return null
    }
    return categories
  }

  static delete = async (categoryId: number, next: NextFunction) => {
    if (!categoryId) {
      errorHandler({ message: 'Invalid search params for deleteCategory(CRUD)', statusCode: 500 }, next)
      return null
    }
    const category = await BudgetDataSource.manager.findOneBy(Category, { id: categoryId })
    if (!category) {
      errorHandler({ message: 'Category not found', statusCode: 403 }, next)
      return null
    }
    await BudgetDataSource.manager.remove(category)
    return category
  }

  static update = async (categoryId: number, { name, categoryType }: { name: string; categoryType: CategoryType }, next: NextFunction) => {
    if (!categoryId || (!name && !categoryType)) {
      errorHandler({ message: 'Invalid search params for updateCategory(CRUD)', statusCode: 500 }, next)
      return null
    }

    const category = await BudgetDataSource.manager.findOneBy(Category, { id: categoryId })
    if (!category) {
      errorHandler({ message: 'Category not found', statusCode: 403 }, next)
      return null
    }
    if (name) category.name = name
    if (categoryType) category.categoryType = categoryType
    await BudgetDataSource.manager.save(category)
    return category
  }
}

export class budgetItemCRUD {
  static add = async (user: User, category: Category, name: string, value: number, userDate: Date, next: NextFunction) => {
    if (!user || !name || !category || !value || !userDate) {
      errorHandler({ message: 'Invalid search params for addBudgetItem(CRUD)', statusCode: 500 }, next)
      return null
    }
    const budgetItem = new BudgetItem()
    budgetItem.user = user
    budgetItem.category = category
    budgetItem.name = name
    budgetItem.value = value
    budgetItem.userDate = userDate
    await BudgetDataSource.manager.save(budgetItem)
    return budgetItem
  }

  static get = async (userId: UserId, next: NextFunction, filters?: BudgetItemsFilters) => {
    if (!userId) {
      errorHandler({ message: 'Invalid search params for getBudgetItems(CRUD)', statusCode: 500 }, next)
      return null
    }
    const queryBuilder = BudgetDataSource.getRepository(BudgetItem).createQueryBuilder('budget')
    queryBuilder
      .leftJoin('budget.category', 'category')
      .addSelect(['category.id', 'category.name', 'category.categoryType'])
      .where('budget.user = :userId', { userId })

    if (filters?.ignore !== undefined && filters.ignore) {
      queryBuilder.andWhere('budget.ignore = :ignore', { ignore: filters.ignore })
    } else {
      if (filters?.active === QueryFilter.MONTH && filters?.month) {
        queryBuilder.andWhere("TO_CHAR(budget.userDate, 'YYYY-MM') = :month", { month: filters.month })
      }

      if (filters?.active === QueryFilter.YEAR && filters?.year) {
        queryBuilder.andWhere("TO_CHAR(budget.userDate, 'YYYY') = :year", { year: filters.year })
      }

      if (filters?.name) {
        queryBuilder.andWhere('budget.name ILIKE :name', { name: `%${filters.name}%` })
      }

      if (filters?.category) {
        queryBuilder.andWhere('category.id = :category', { category: filters.category })
      }

      if (filters?.categoryType) {
        queryBuilder.andWhere('category.categoryType = :categoryType', { categoryType: filters.categoryType })
      }
    }

    const budgetItems = await queryBuilder.orderBy('budget.userDate', 'DESC').getMany()

    if (!budgetItems) {
      errorHandler({ message: 'No budget items for this user', statusCode: 403 }, next)
      return null
    }
    return budgetItems
  }

  static delete = async (budgetItemId: number, next: NextFunction) => {
    if (!budgetItemId) {
      errorHandler({ message: 'Invalid search params for deleteBudgetItem(CRUD)', statusCode: 500 }, next)
      return null
    }
    const budgetItem = await BudgetDataSource.manager.findOneBy(BudgetItem, { id: budgetItemId })
    if (!budgetItem) {
      errorHandler({ message: 'Budget item not found', statusCode: 403 }, next)
      return null
    }
    await BudgetDataSource.manager.remove(budgetItem)
    return budgetItem
  }

  static update = async (
    budgetItemId: number,
    { name, value, userDate, categoryId, ignore }: { name: string; value: number; userDate: Date; categoryId: number; ignore: boolean },
    next: NextFunction
  ) => {
    if (!budgetItemId || (!name && !value && !userDate && !ignore) || !categoryId) {
      errorHandler({ message: 'Invalid search params for updateBudgetItem(CRUD)', statusCode: 500 }, next)
      return null
    }
    const budgetItem = await BudgetDataSource.manager.findOneBy(BudgetItem, { id: budgetItemId })
    if (!budgetItem) {
      errorHandler({ message: 'Budget item not found', statusCode: 403 }, next)
      return null
    }
    if (name) budgetItem.name = name
    if (value) budgetItem.value = value
    if (userDate) budgetItem.userDate = userDate
    if (categoryId) {
      const category = await BudgetDataSource.manager.findOneBy(Category, { id: categoryId })
      if (!category) {
        errorHandler({ message: 'Category not found. updateBudgetItem(CRUD)', statusCode: 404 }, next)
        return null
      }
      budgetItem.category = category
    }
    if (ignore !== undefined) budgetItem.ignore = ignore
    await BudgetDataSource.manager.save(budgetItem)
    return budgetItem
  }
}
