import jwt, { JwtPayload } from 'jsonwebtoken'

import { RequestHandler } from 'express'

import { SERVER_JWT_SECRET } from '../utils/config'
import { errorHandler } from '../utils/errors'
import { getUser } from '../db/crud'

const auth: RequestHandler = async (req, res, next) => {
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    return errorHandler({ message: 'Not authenticated', statusCode: 401 }, next)
  }
  const token = authHeader.split(' ')[1]
  let decodedToken: string | JwtPayload

  try {
    decodedToken = jwt.verify(token, SERVER_JWT_SECRET!)
  } catch (err) {
    return errorHandler({ message: 'Not authenticated', statusCode: 401, details: err }, next)
  }

  if (!decodedToken) {
    return errorHandler({ message: 'Not authenticated', statusCode: 401, details: 'Invalid token' }, next)
  }
  if (typeof decodedToken === 'object') {
    req.userId = decodedToken.userId
  } else {
    errorHandler({ message: 'Not authenticated', statusCode: 401, details: 'Invalid token' }, next)
  }

  try {
    const user = await getUser({ userId: req.userId }, next)
    if (!user) return
    req.user = user
  } catch (err) {
    errorHandler({ message: 'Failed to authenticate', statusCode: 500, details: err }, next)
  }
  next()
}

export default auth