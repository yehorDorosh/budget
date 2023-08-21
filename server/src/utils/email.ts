import nodemailer from 'nodemailer'
import { SERVER_EMAIL_PASS, SERVER_EMAIL_USER } from './config'

export const transport = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: SERVER_EMAIL_USER,
    pass: SERVER_EMAIL_PASS
  }
})
