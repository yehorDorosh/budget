import { DataSource } from 'typeorm'

import {
  isDev,
  DB_HOST_DEV,
  DB_HOST,
  DB_PORT_DEV,
  DB_PORT,
  DB_USERNAME_DEV,
  DB_USERNAME,
  DB_PASSWORD_DEV,
  DB_PASSWORD,
  DB_NAME
} from '../utils/config'
import { User } from '../models/user'
import { Category } from '../models/category'
import { BudgetItem } from '../models/budget-item'
import { Weather } from '../models/weather'
import { ModelCRUD } from './model-crud'
import { WeatherCRUD } from './weather-crud'
import { BudgetItemCRUD } from './budget-item-crud'

export const BudgetDataSource = new DataSource({
  type: 'postgres',
  host: isDev ? DB_HOST_DEV : DB_HOST,
  port: parseInt(isDev ? DB_PORT_DEV! : DB_PORT!),
  username: isDev ? DB_USERNAME_DEV : DB_USERNAME,
  password: isDev ? DB_PASSWORD_DEV : DB_PASSWORD,
  database: DB_NAME,
  entities: [User, Category, BudgetItem, Weather],
  logging: isDev,
  synchronize: isDev
})

export const userCRUD = new ModelCRUD(User, BudgetDataSource)
export const categoryCRUD = new ModelCRUD(Category, BudgetDataSource)
export const budgetItemCRUD = new BudgetItemCRUD(BudgetItem, BudgetDataSource)
export const weatherCRUD = new WeatherCRUD(Weather, BudgetDataSource)
