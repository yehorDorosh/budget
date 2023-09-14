import path from 'path'

import express from 'express'
import bodyParser from 'body-parser'

import { SERVER_PORT, SERVER_PORT_DEV, isDev } from './utils/config'
import { expressErrorHandler } from './utils/errors'
import userRouter from './routes/user'
import categoriesRouter from './routes/categories'
import budgetItemRouter from './routes/budget-item'
import weatherRouter from './routes/weather'
import { BudgetDataSource } from './db/data-source'
import auth from './middleware/auth'

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')))

app.use(bodyParser.json())

app.get('/api', auth, (req, res) => {
  res.status(200).json({ message: 'Hello World form api' })
})

app.use('/api/user', userRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/budget', budgetItemRouter)
app.use('/api/weather', weatherRouter)

app.use((req, res) => {
  res.status(200).sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'))
})

app.use(expressErrorHandler)

init()

async function init() {
  try {
    await BudgetDataSource.initialize()
    console.log('Database initialized')
    app.listen(isDev ? SERVER_PORT_DEV : SERVER_PORT)
  } catch (err) {
    console.error('Database failed to initialize', err)
  }
}
