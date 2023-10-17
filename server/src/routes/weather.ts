import express from 'express'

import { notEmptyValidator } from '../utils/validators'
import { validationErrorsHandler } from '../utils/errors'
import { saveWeatherData, getWeatherData, getLastWeatherData } from '../controllers/weather'

const router = express.Router()

router.post(
  '/',
  [notEmptyValidator('id'), notEmptyValidator('t'), notEmptyValidator('p'), notEmptyValidator('v')],
  validationErrorsHandler('Add weather item validation failed.'),
  saveWeatherData
)

router.get('/', getWeatherData)

router.get('/last-weather', getLastWeatherData)

export default router
