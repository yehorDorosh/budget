import axios from 'axios'

import { CategoryType } from '../types/enums'
import { DataSource } from 'typeorm'
import { User } from '../models/user'
import { Category } from '../models/category'
import { BudgetItem } from '../models/budget-item'

interface CategoryResponse {
  data: string
  error: boolean
  errorMessage: string
}

interface ExternalBudgetItem {
  id: string
  amount: string
  category: string
  category_type: string
  date: string
  email: string
  log_date: string
  name: string
}

interface BudgetItemResponse {
  data: ExternalBudgetItem[]
  error: boolean
  errorMessage: string
}

async function initDB() {
  const BudgetDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? +process.env.DB_PORT : 3432,
    username: process.env.DB_USERNAME || 'admin',
    password: process.env.DB_PASSWORD || 'secret',
    database: process.env.DB_NAME || 'budget',
    entities: [User, Category, BudgetItem],
    logging: true,
    synchronize: true
  })

  try {
    return await BudgetDataSource.initialize()
  } catch (err) {
    console.error('Database failed to initialize', err)
    return Promise.reject(err)
  }
}

async function migrateCategories(type: CategoryType, email: string, userId: number, dataSource: DataSource) {
  try {
    const { data, status } = await axios.get<CategoryResponse>(`http://35.178.207.100/api/category.php?email=${email}&categoryType=${type}`)
    if (status === 200 && !data.error) {
      console.log('Migration: categories recived')
      const categories = JSON.parse(data.data)
      if (!Array.isArray(categories)) {
        console.log('Migration: categories is not array')
        return Promise.reject('Migration: categories is not array')
      }

      const index = categories.indexOf('all')
      if (index !== -1) categories.splice(index, 1)

      const user = await dataSource.manager.findOneBy(User, { id: userId })
      if (!user) {
        console.log('Migration: user not found')
        return Promise.reject('Migration: user not found')
      }

      for (const name of categories) {
        const category = new Category()
        category.name = name
        category.categoryType = type
        category.user = user
        await dataSource.manager.save(category)
      }
      console.log(`Migration: ${CategoryType.EXPENSE} categories added`)
      return Promise.resolve()
    }
  } catch (error) {
    console.log(error)
    console.log('Migration: Categories fetching failed')
    return Promise.reject(error)
  }
}

async function migrateBudgetItems(email: string, userId: number, dataSource: DataSource) {
  try {
    const { data, status } = await axios.get<BudgetItemResponse>(`http://35.178.207.100/api/budget.php?email=${email}`)
    if (status === 200 && !data.error) {
      console.log('Migration: budget items recived')
      const budgetItems = data.data
      if (!Array.isArray(budgetItems)) {
        console.log('Migration: budget items is not array')
        return Promise.reject('Migration: budget items is not array')
      }

      const user = await dataSource.manager.findOneBy(User, { id: userId })
      if (!user) {
        console.log('Migration: user not found')
        return Promise.reject('Migration: user not found')
      }

      for (const importedBudgetItem of budgetItems) {
        const category = await dataSource.manager.findOneBy(Category, { name: importedBudgetItem.category })
        if (!category) {
          console.log(`Migration: category ${importedBudgetItem.category} not found`)
          continue
        }
        const budgetItem = new BudgetItem()
        budgetItem.user = user
        budgetItem.category = category
        budgetItem.name = importedBudgetItem.name
        budgetItem.value = +importedBudgetItem.amount
        budgetItem.userDate = new Date(importedBudgetItem.date)
        await dataSource.manager.save(budgetItem)
      }
      console.log(`Migration: budget items added`)
      return Promise.resolve()
    }
  } catch (error) {
    console.log(error)
    console.log('Migration: Budget items fetching failed')
    return Promise.reject(error)
  }
}

const migration = async () => {
  const email = process.env.EMAIL
  const newUserId = process.env.USER_ID && +process.env.USER_ID

  if (!email) {
    console.log('Migration: EMAIL env var dosnt set')
    return
  }

  if (!newUserId) {
    console.log('Migration: USER_ID env var dosnt set')
    return
  }

  try {
    const dataSource = await initDB()
    if (dataSource) console.log('Database initialized')
    else return console.log('Database initialized failed')

    switch (process.env.MIGRATION) {
      case 'categories':
        await migrateCategories(CategoryType.EXPENSE, email, newUserId, dataSource)
        await migrateCategories(CategoryType.INCOME, email, newUserId, dataSource)
        break
      case 'budget':
        await migrateBudgetItems(email, newUserId, dataSource)
        break
      default:
        console.log('Migration: MIGRATION env var dosnt set')
    }
  } catch (error) {
    console.log(error)
  }
}

migration()