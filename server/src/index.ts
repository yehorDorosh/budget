import path from 'path'

import express from 'express'

import { SERVER_PORT, SERVER_PORT_DEV, isDev } from './utils/config'
import userRouter from './routes/user'
import { budgetDataSource } from './db/data-source'

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')))

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Hello World form api' })
})

app.use((req, res) => {
  res.status(200).sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'))
})

app.use('/api/user', userRouter)

init()

async function init() {
  try {
    await budgetDataSource.initialize()
    console.log('Database initialized')
    app.listen(isDev ? SERVER_PORT_DEV : SERVER_PORT)
  } catch (err) {
    console.error('Database failed to initialize', err)
  }
}
