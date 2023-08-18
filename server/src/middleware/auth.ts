import jwt, { JwtPayload } from 'jsonwebtoken'

import { RequestHandler } from 'express'

import { SERVER_JWT_SECRET } from '../utils/config'
import { errorHandler } from '../utils/errors'

const auth: RequestHandler = (req, res, next) => {
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    return errorHandler({ message: 'Not authenticated', statusCode: 401 })
  }
  const token = authHeader.split(' ')[1]
  let decodedToken: string | JwtPayload
  try {
    decodedToken = jwt.verify(token, SERVER_JWT_SECRET!)
  } catch (err) {
    return errorHandler({ message: 'Not authenticated', statusCode: 401, details: err })
  }
  if (!decodedToken) {
    return errorHandler({ message: 'Not authenticated', statusCode: 401, details: 'Invalid token' })
  }
  if (typeof decodedToken === 'object') req.userId = decodedToken.userId
  next()
}

export default auth
