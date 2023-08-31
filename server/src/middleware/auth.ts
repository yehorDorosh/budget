import * as jose from 'jose'

import { RequestHandler } from 'express'

import { SERVER_JWT_SECRET } from '../utils/config'
import { errorHandler } from '../utils/errors'
import { UserCRUD } from '../db/crud'

const auth: RequestHandler = async (req, res, next) => {
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    return errorHandler({ message: 'Not authenticated', statusCode: 401 }, next)
  }
  const token = authHeader.split(' ')[1]
  let decodedToken: jose.JWTVerifyResult

  try {
    decodedToken = await jose.jwtVerify(token, new TextEncoder().encode(SERVER_JWT_SECRET!))
  } catch (err) {
    return errorHandler({ message: 'Not authenticated', statusCode: 401, details: err }, next)
  }

  if (!decodedToken || !decodedToken.payload || !decodedToken.payload.userId) {
    return errorHandler({ message: 'Not authenticated', statusCode: 401, details: 'Invalid token' }, next)
  }
  req.userId = decodedToken.payload.userId as number

  try {
    const user = await UserCRUD.get({ userId: req.userId }, next)
    req.user = user!
  } catch (err) {
    errorHandler({ message: 'Failed to authenticate', statusCode: 500, details: err }, next)
  }
  next()
}

export default auth
