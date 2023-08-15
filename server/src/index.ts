import path from 'path'

import express from 'express'
import dotenv from 'dotenv'

import userRouter from './routes/user'

dotenv.config({ path: path.join(__dirname, '.env') })
const { SERVER_PORT_DEV } = process.env

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
  app.listen(SERVER_PORT_DEV)
}
