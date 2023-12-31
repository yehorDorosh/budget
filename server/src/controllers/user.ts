import bcrypt from 'bcryptjs'
import * as jose from 'jose'

import { RequestHandler } from 'express'
import { AppRes } from '../types/express/custom-response'
import { ResCodes } from '../types/enums'

import { transport } from '../utils/email'
import { SERVER_JWT_SECRET, SERVER_EMAIL_USER, SERVER_HOST_NAME, isDev } from '../utils/config'
import { errorHandler } from '../utils/errors'
import { User } from '../models/user'
import { userCRUD } from '../db/data-source'
import { SERVER_LOGOUT_TIMER } from '../utils/config'

function generateToken(userId: number, time: string = SERVER_LOGOUT_TIMER!) {
  const secret = new TextEncoder().encode(SERVER_JWT_SECRET!)
  return new jose.SignJWT({ userId }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime(time).sign(secret)
}

export const signup: RequestHandler = async (req, res: AppRes<UserPayload>, next) => {
  const email: string = req.body.email
  const password: string = req.body.password

  try {
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await userCRUD.add({ email, password: hashedPassword }, next)
    if (!user) return errorHandler({ message: 'Failed to create new user.' }, next)

    const token = await generateToken(user.id)

    const userState: UserState = { id: user.id, email: user.email, token }
    res.status(201).json({ message: 'Create new user.', code: ResCodes.CREATE_USER, payload: { user: userState } })
  } catch (err) {
    errorHandler({ message: 'Failed to create new user.', details: err }, next)
  }
}

export const login: RequestHandler = async (req, res: AppRes<UserPayload>, next) => {
  const email: string = req.body.email
  const password: string = req.body.password

  try {
    const user = await userCRUD.findOne({ where: { email } }, next)
    if (!user) return errorHandler({ message: 'Failed to login. User not found.', statusCode: 401 }, next)

    const isEqual = await bcrypt.compare(password, user.password)
    if (!isEqual) {
      return errorHandler({ message: 'Failed to login. Wrong password.', statusCode: 401 }, next)
    }

    const token = await generateToken(user.id)

    const userState: UserState = { id: user.id, email: user.email, token }
    res.status(200).json({ message: 'Login success.', code: ResCodes.LOGIN, payload: { user: userState } })
  } catch (err) {
    errorHandler({ message: 'Failed to login.', details: err }, next)
  }
}

export const sendRestorePasswordEmail: RequestHandler = async (req, res: AppRes, next) => {
  const email: string = req.body.email

  try {
    const user = await userCRUD.findOne({ where: { email } }, next)
    if (!user) return errorHandler({ message: 'Failed to send email to restore password. User not found.', statusCode: 401 }, next)

    const token = await generateToken(user.id, '15m')

    await transport.sendMail({
      from: `"Egor" <${SERVER_EMAIL_USER}>`,
      to: email,
      subject: 'Restore password',
      html: `<p>
              To restore your password follow by this 
              <a href="${req.protocol}://${isDev ? req.headers.host : SERVER_HOST_NAME}/restore-password/${token}">
                link
              </a>
            </p> `
    })

    res.status(200).json({ message: 'Restore password email was sent.', code: ResCodes.SEND_RESTORE_PASSWORD_EMAIL })
  } catch (err) {
    errorHandler({ message: 'Failed to send email to restore password.', details: err }, next)
  }
}

export const restorePassword: RequestHandler = async (req, res: AppRes, next) => {
  const token = req.params.token
  const password: string = req.body.password
  let decodedToken: jose.JWTVerifyResult
  let user: User | null

  try {
    decodedToken = await jose.jwtVerify(token, new TextEncoder().encode(SERVER_JWT_SECRET!))
    if (!decodedToken || !decodedToken.payload || !decodedToken.payload.userId) {
      return errorHandler({ message: 'Failed to restore password. Not authenticated.', statusCode: 401, details: 'Invalid token' }, next)
    }

    user = await userCRUD.findOne({ where: { id: +decodedToken.payload.userId } }, next)
    if (!user) return errorHandler({ message: 'Failed to restore password. User not found.', statusCode: 403 }, next)

    const hashedPassword = await bcrypt.hash(password, 12)
    userCRUD.update(user, { password: hashedPassword }, next)

    res.status(200).json({ message: 'Password was restored.', code: ResCodes.RESET_PASSWORD })
  } catch (err) {
    errorHandler({ message: 'Failed to restore password.', details: err, statusCode: 401 }, next)
  }
}

export const getUserInfo: RequestHandler = async (req, res: AppRes<UserPayload>) => {
  const user = req.user!

  res.status(200).json({
    message: 'User info was sent successfully.',
    code: ResCodes.SEND_USER,
    payload: { user: { id: user.id, email: user.email, token: null } }
  })
}

export const updateUser: RequestHandler = async (req, res: AppRes<UserPayload>, next) => {
  const user = req.user!
  const email: string | undefined = req.body.email
  const password: string | undefined = req.body.password

  try {
    let newUser: User | null = null
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12)
      newUser = await userCRUD.update(user, { password: hashedPassword }, next)
    }

    if (email) {
      newUser = await userCRUD.update(user, { email }, next)
    }

    if (!newUser) return errorHandler({ message: 'Failed to update user.' }, next)

    const userState: UserState = { id: newUser.id, email: newUser.email, token: null }
    res.status(200).json({ message: 'User was updated.', code: ResCodes.UPDATE_USER, payload: { user: userState } })
  } catch (err) {
    errorHandler({ message: 'Failed to update user.', details: err }, next)
  }
}

export const deleteUser: RequestHandler = async (req, res: AppRes, next) => {
  const user = req.user!
  const password: string = req.body.password

  try {
    const isEqual = await bcrypt.compare(password, user.password)
    if (!isEqual) {
      return errorHandler({ message: 'Failed to delete user. Wrong password', statusCode: 401 }, next)
    }

    const result = await userCRUD.delete(user.id, next)

    if (result === true) {
      res.status(200).json({ message: 'User was deleted.', code: ResCodes.DELETE_USER })
    } else {
      return errorHandler({ message: 'Failed to delete user. No one user was deleted.' }, next)
    }
  } catch (err) {
    errorHandler({ message: 'Failed to delete user.', details: err }, next)
  }
}
