import React, { FC } from 'react'

import classes from './BaseForm.module.scss'

interface BaseFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
}

const BaseForm: FC<BaseFormProps> = ({ children, ...props }) => {
  return (
    <form className={classes.form} {...props}>
      {children}
    </form>
  )
}

export default BaseForm
