import path from 'path'

import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'

import { SERVER_PORT, SERVER_PORT_DEV, isDev } from './utils/config'
import { ProjectError } from './utils/errors'
import userRouter from './routes/user'
import { BudgetDataSource } from './db/data-source'

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')))

app.use(bodyParser.json())

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Hello World form api' })
})

app.use('/api/user', userRouter)

app.use((req, res) => {
  res.status(200).sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'))
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(((err: Error, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ProjectError) {
    res.status(err.statusCode).json({ message: 'Internal server error', cause: err.message, details: err.details })
  } else {
    res.status(500).json({ message: 'Internal server error', cause: err.message })
  }
}) as ErrorRequestHandler)

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION\n', err.stack)
  // close DB connection
  // log error
  process.exit(1)
})

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
