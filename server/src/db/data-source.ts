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
import { Users } from '../models/users'

export const BudgetDataSource = new DataSource({
  type: 'postgres',
  host: isDev ? DB_HOST_DEV : DB_HOST,
  port: parseInt(isDev ? DB_PORT_DEV! : DB_PORT!),
  username: isDev ? DB_USERNAME_DEV : DB_USERNAME,
  password: isDev ? DB_PASSWORD_DEV : DB_PASSWORD,
  database: DB_NAME,
  entities: [Users],
  logging: true,
  synchronize: true
})
