import { NextFunction } from 'express'
import { CategoryType, QueryFilter } from '../types/enums'
import { BudgetItem } from '../models/budget-item'
import { ModelCRUD } from '../db/model-crud'
import { errorHandler } from '../utils/errors'
import { SelectQueryBuilder } from 'typeorm'

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
      this.applyFilters(queryBuilder, filters)
    }

    queryBuilder.orderBy('budget.userDate', 'DESC').addOrderBy('budget.createdAt', 'DESC').addOrderBy('budget.id', 'DESC')

    if (filters.page && filters.perPage) {
      queryBuilder.offset((filters.page - 1) * filters.perPage).limit(filters.perPage)
    }

    const budgetItems = await queryBuilder.getMany()

    return budgetItems
  }

  async getStatistics(userId: UserId, filters: BudgetItemsFilters, next: NextFunction) {
    if (!userId) {
      errorHandler({ message: 'Invalid search params for findManyWithFilters(CRUD)', statusCode: 500 }, next)
      return null
    }
    const queryBuilder = this.dataSource.getRepository(BudgetItem).createQueryBuilder('budget')
    queryBuilder
      .leftJoin('budget.category', 'category')
      .addSelect(['category.id', 'category.name', 'category.categoryType'])
      .where('budget.user = :userId', { userId })

    this.applyFilters(queryBuilder, filters)

    const expensesTable = await queryBuilder
      .select('SUM(budget.value)', 'value')
      .andWhere('category.categoryType = :categoryType', { categoryType: CategoryType.EXPENSE })
      .getRawOne<{ value: string | null }>()

    const incomesTable = await queryBuilder
      .select('SUM(budget.value)', 'value')
      .andWhere('category.categoryType = :categoryType', { categoryType: CategoryType.INCOME })
      .getRawOne<{ value: string | null }>()

    const expenses = expensesTable && expensesTable.value !== null && expensesTable.value !== undefined ? expensesTable.value : null
    const incomes = incomesTable && incomesTable.value !== null && incomesTable.value !== undefined ? incomesTable.value : null
    const sum = expenses !== null && incomes !== null ? (+incomes - +expenses).toFixed(2) : null

    return { sum, expenses, incomes }
  }

  getCategoriesRates(userId: UserId, filters: BudgetItemsFilters, next: NextFunction) {
    if (!userId) {
      errorHandler({ message: 'Invalid search params for findManyWithFilters(CRUD)', statusCode: 500 }, next)
      return null
    }
    const queryBuilder = this.dataSource.getRepository(BudgetItem).createQueryBuilder('budget')
    queryBuilder
      .leftJoin('budget.category', 'category')
      .addSelect(['category.id', 'category.name', 'category.categoryType'])
      .where('budget.user = :userId', { userId })

    this.applyFilters(queryBuilder, filters)

    return queryBuilder
      .select(['category.name AS name', 'SUM(budget.value)'])
      .andWhere('category.categoryType = :categoryType', { categoryType: CategoryType.EXPENSE })
      .groupBy('category.id')
      .orderBy('sum', 'DESC')
      .getRawMany<CategoryRate>()
  }

  private applyFilters(queryBuilder: SelectQueryBuilder<BudgetItem>, filters: BudgetItemsFilters) {
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

    return queryBuilder
  }
}
