import { RequestHandler } from 'express'

export const signup: RequestHandler = (req, res) => {
  res.status(200).json({ message: 'signup' })
}
