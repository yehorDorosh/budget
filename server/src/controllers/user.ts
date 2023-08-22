import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { RequestHandler } from 'express'

import { transport } from '../utils/email'
import { SERVER_JWT_SECRET, SERVER_EMAIL_USER } from '../utils/config'
import { errorHandler } from '../utils/errors'
import { BudgetDataSource } from '../db/data-source'
import { User } from '../models/user'
import { getUser } from '../db/crud'

function generateToken(userId: number) {
  return jwt.sign({ userId }, SERVER_JWT_SECRET!, { expiresIn: '1h' })
}

export const signup: RequestHandler = async (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const user = new User()
  user.email = email

  try {
    user.password = await bcrypt.hash(password, 12)
    await BudgetDataSource.manager.save(user)
    const token = generateToken(user.id)
    res.status(201).json({ message: 'Create new user', user: { id: user.id, email: user.email, token } })
  } catch (err) {
    errorHandler({ message: 'Failed to create new user', details: err }, next)
  }
}

export const login: RequestHandler = async (req, res, next) => {
  const email: string = req.body.email
  const password: string = req.body.password

  try {
    const user = await getUser({ email }, next)
    if (!user) return
    const isEqual = await bcrypt.compare(password, user.password)
    if (!isEqual) {
      return errorHandler({ message: 'Wrong password', statusCode: 403 }, next)
    }

    const token = generateToken(user.id)
    res.status(200).json({ message: 'Login success', user: { id: user.id, email: user.email, token } })
  } catch (err) {
    errorHandler({ message: 'Failed to login', details: err }, next)
  }
}

export const sendRestorePasswordEmail: RequestHandler = async (req, res, next) => {
  const email = req.body.email

  try {
    const user = await getUser({ email }, next)
    if (!user) return
    const token = jwt.sign({ userId: user.id }, SERVER_JWT_SECRET!, { expiresIn: '15m' })

    await transport.sendMail({
      from: `"Egor" <${SERVER_EMAIL_USER}>`,
      to: email,
      subject: 'Restore password',
      html: `<p>
              To restore your password follow by this 
              <a href="${req.protocol}://${req.headers.host}/restore-password/${token}">
                link
              </a>
            </p> `
    })

    res.status(200).json({ message: 'Restore password email was sent' })
  } catch (err) {
    errorHandler({ message: 'Failed to send email to restore password', details: err }, next)
  }
}

export const restorePassword: RequestHandler = async (req, res, next) => {
  const token: string = req.params.token
  const newPassword: string = req.body.newPassword
  let decodedToken: string | jwt.JwtPayload
  let user: User | null

  try {
    decodedToken = await jwt.verify(token, SERVER_JWT_SECRET!)
    if (!decodedToken) {
      return errorHandler({ message: 'Not authenticated', statusCode: 401, details: 'Invalid token' }, next)
    }
    if (typeof decodedToken === 'object') {
      user = await getUser({ userId: decodedToken.userId }, next)
      if (!user) return
      user.password = await bcrypt.hash(newPassword, 12)
      await BudgetDataSource.manager.save(user)
      res.status(200).json({ message: 'Password was restored' })
    } else {
      errorHandler({ message: 'Invalid token when password restoring', details: decodedToken }, next)
    }
  } catch (err) {
    errorHandler({ message: 'Failed to restore password', details: err }, next)
  }
}
