import path from 'path'

import express from 'express'
import dotenv from 'dotenv'

dotenv.config({ path: path.join(__dirname, '.env') })
const { SERVER_PORT_DEV } = process.env

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.send('Hello World')
})

init()

async function init() {
  app.listen(SERVER_PORT_DEV)
}
