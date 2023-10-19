import { NextFunction } from 'express'
import { QueryFilter } from '../types/enums'
import { BudgetItem } from '../models/budget-item'
import { ModelCRUD } from '../db/model-crud'
import { errorHandler } from '../utils/errors'

export class BudgetItemCRUD extends ModelCRUD<BudgetItem> {
  async findManyWithFilters(userId: UserId, filters: BudgetItemsFilters, next: NextFunction) {
    if (!userId) {
      errorHandler({ message: 'Invalid search params for findManyWithFilters(CRUD)', statusCode: 500 }, next)
      return null
    }
    const queryBuilder = this.dataSource.getRepository(BudgetItem).createQueryBuilder('budget')
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

    const budgetItems = await queryBuilder
      .orderBy('budget.userDate', 'DESC')
      .addOrderBy('budget.createdAt', 'DESC')
      .addOrderBy('budget.id', 'DESC')
      .getMany()

    return budgetItems
  }
}
