import path from 'path'
import fs from 'fs'

import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'

import { SERVER_PORT, SERVER_PORT_DEV, isDev, NODE_ENV } from './utils/config'
import { expressErrorHandler } from './utils/errors'
import userRouter from './routes/user'
import categoriesRouter from './routes/categories'
import budgetItemRouter from './routes/budget-item'
import weatherRouter from './routes/weather'
import { BudgetDataSource } from './db/data-source'
import { ModelCRUD } from './db/model-crud'
import { Category } from './models/category'

const app = express()

if (NODE_ENV !== 'test') {
  if (!fs.existsSync(path.join(__dirname, 'logs'))) fs.mkdirSync(path.join(__dirname, 'logs'))
  const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs', 'server-error.log'), { flags: 'a' })
  app.use(
    morgan('combined', {
      stream: accessLogStream,
      skip(req, res) {
        return res.statusCode < 400
      }
    })
  )
}

app.use(express.static(path.join(__dirname, 'public')))
if (isDev) app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')))

app.use(bodyParser.json())

if (isDev) {
  app.get('/api', async (req, res, next) => {
    const categoryCRUD = new ModelCRUD(Category, BudgetDataSource)
    const result = await categoryCRUD.findOne({ where: { name: 'car' } }, next)
    res.status(200).json({ message: 'Hello World form api', result })
  })
}

app.use('/api/user', userRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/budget', budgetItemRouter)
app.use('/api/weather', weatherRouter)

app.use((req, res) => {
  if (isDev) {
    res.status(200).sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'))
  } else {
    res.status(200).sendFile(path.join(__dirname, 'public', 'index.html'))
  }
})

app.use(expressErrorHandler)

init()

async function init() {
  try {
    await BudgetDataSource.initialize()
    console.log('Database initialized')
    if (NODE_ENV !== 'test')
      app.listen(isDev ? SERVER_PORT_DEV : SERVER_PORT, () =>
        console.log(`Server started on port ${isDev ? SERVER_PORT_DEV : SERVER_PORT}`)
      )
  } catch (err) {
    console.error('Database failed to initialize', err)
  }
}

export default app
