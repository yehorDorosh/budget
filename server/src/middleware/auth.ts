import * as jose from 'jose'

import { RequestHandler } from 'express'

import { SERVER_JWT_SECRET } from '../utils/config'
import { errorHandler } from '../utils/errors'
import { userCRUD } from '../db/data-source'

const auth: RequestHandler = async (req, res, next) => {
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    return errorHandler({ message: 'Not authenticated. Invalid Authorization header.', statusCode: 401 }, next)
  }
  const token = authHeader.split(' ')[1]
  let decodedToken: jose.JWTVerifyResult

  try {
    decodedToken = await jose.jwtVerify(token, new TextEncoder().encode(SERVER_JWT_SECRET!))
  } catch (err) {
    return errorHandler({ message: 'Not authenticated.  Invalid token.', statusCode: 401, details: err }, next)
  }

  if (!decodedToken || !decodedToken.payload || !decodedToken.payload.userId) {
    return errorHandler({ message: 'Failed to authenticate. Invalid token.', statusCode: 401 }, next)
  }
  req.userId = +decodedToken.payload.userId

  try {
    const user = await userCRUD.findOne({ where: { id: req.userId } }, next)
    if (!user) return errorHandler({ message: 'Failed to authenticate. User not found.', statusCode: 403 }, next)

    req.user = user
  } catch (err) {
    errorHandler({ message: 'Failed to authenticate.', statusCode: 403, details: err }, next)
  }
  next()
}

export default auth
