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

    if (filters?.id !== undefined && filters.id) {
      queryBuilder.andWhere('budget.id = :id', { id: filters.id })
    } else if (filters?.ignore !== undefined && filters.ignore) {
      queryBuilder.andWhere('budget.ignore = :ignore', { ignore: filters.ignore })
    } else {
      this.applyFilters(queryBuilder, filters)
    }

    queryBuilder.orderBy('budget.userDate', 'DESC').addOrderBy('budget.createdAt', 'DESC').addOrderBy('budget.id', 'DESC')

    if (filters.page && filters.perPage && !filters.id) {
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

  async getCategoriesRates(userId: UserId, filters: BudgetItemsFilters, next: NextFunction) {
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

    return await queryBuilder
      .select(['category.name AS name', 'SUM(budget.value)'])
      .andWhere('category.categoryType = :categoryType', { categoryType: CategoryType.EXPENSE })
      .groupBy('category.id')
      .orderBy('sum', 'DESC')
      .getRawMany<CategoryRate>()
  }

  async getTrendData(userId: UserId, filters: BudgetItemsFilters, next: NextFunction) {
    if (!userId || filters.year === undefined) {
      errorHandler({ message: 'Invalid search params for findManyWithFilters(CRUD)', statusCode: 500 }, next)
      return null
    }

    const isCurrentYear = new Date().getFullYear() === +filters.year
    const monthsAmount = isCurrentYear ? new Date().getMonth() + 1 : 12

    const queryBuilder = this.dataSource.getRepository(BudgetItem).createQueryBuilder('budget')
    queryBuilder
      .leftJoin('budget.category', 'category')
      .addSelect(['category.id', 'category.name', 'category.categoryType'])
      .where('budget.user = :userId', { userId })
      .andWhere('budget.ignore = :ignore', { ignore: false })
      .andWhere("TO_CHAR(budget.userDate, 'YYYY') = :year", { year: filters.year })

    const expensesTable = await queryBuilder
      .select('SUM(budget.value)', 'value')
      .andWhere('category.categoryType = :categoryType', { categoryType: CategoryType.EXPENSE })
      .getRawOne<{ value: string | null }>()

    const incomesTable = await queryBuilder
      .select('SUM(budget.value)', 'value')
      .andWhere('category.categoryType = :categoryType', { categoryType: CategoryType.INCOME })
      .getRawOne<{ value: string | null }>()

    const monthlyExpenses = await queryBuilder
      .select('EXTRACT(MONTH FROM budget.user_date) - 1 AS month')
      .addSelect('SUM(budget.value)', 'total')
      .andWhere('category.categoryType = :categoryType', { categoryType: CategoryType.EXPENSE })
      .groupBy('month')
      .getRawMany()

    const monthlyIncomes = await queryBuilder
      .select('EXTRACT(MONTH FROM budget.user_date) - 1 AS month')
      .addSelect('SUM(budget.value)', 'total')
      .andWhere('category.categoryType = :categoryType', { categoryType: CategoryType.INCOME })
      .groupBy('month')
      .getRawMany()

    const maxTotal = [...monthlyExpenses, ...monthlyIncomes].reduce((max, item) => {
      const total = parseFloat(item.total)
      return total > max ? total : max
    }, 0)

    const averageExpenses =
      expensesTable && expensesTable.value !== null && expensesTable.value !== undefined
        ? (+expensesTable.value / monthsAmount).toFixed(2)
        : null

    const averageIncomes =
      incomesTable && incomesTable.value !== null && incomesTable.value !== undefined
        ? (+incomesTable.value / monthsAmount).toFixed(2)
        : null

    const averageSaved = averageExpenses !== null && averageIncomes !== null ? (+averageIncomes - +averageExpenses).toFixed(2) : null
    const totalSaved =
      expensesTable && expensesTable.value !== null && incomesTable && incomesTable.value !== null
        ? (+incomesTable.value - +expensesTable.value).toFixed(2)
        : null

    return { averageExpenses, averageIncomes, averageSaved, totalSaved, monthlyExpenses, monthlyIncomes, maxTotal: maxTotal.toFixed(2) }
  }

  async getListOfMatches(userId: UserId, name: string, next: NextFunction) {
    if (!userId) {
      errorHandler({ message: 'Invalid search params for findManyWithFilters(CRUD)', statusCode: 500 }, next)
      return null
    }

    const queryBuilder = this.dataSource.getRepository(BudgetItem).createQueryBuilder('budget')
    queryBuilder
      .select('budget.name AS name')
      .distinct(true)
      .where('budget.user = :userId', { userId })
      .andWhere('budget.name ILIKE :name', { name: `%${name}%` })

    return await queryBuilder.getRawMany<{ name: string }>()
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
