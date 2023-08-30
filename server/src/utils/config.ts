import path from 'path'

import dotenv from 'dotenv'

dotenv.config({ path: path.join(__dirname, '.env') })

export const {
  SERVER_PORT_DEV,
  SERVER_PORT,
  SERVER_JWT_SECRET,
  SERVER_EMAIL_PASS,
  SERVER_EMAIL_USER,
  SERVER_LOGOUT_TIMER,
  NODE_ENV,
  DB_HOST_DEV,
  DB_HOST,
  DB_PORT_DEV,
  DB_PORT,
  DB_USERNAME_DEV,
  DB_USERNAME,
  DB_PASSWORD_DEV,
  DB_PASSWORD,
  DB_NAME
} = process.env

export const isDev = NODE_ENV === 'development'
