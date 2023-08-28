import React, { FC } from 'react'

import classes from './BaseForm.module.scss'

interface BaseFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
  isLoading: boolean
}

const BaseForm: FC<BaseFormProps> = ({ children, isLoading, ...props }) => {
  return (
    <form className={classes.form} {...props}>
      {children}
      {isLoading && (
        <div className={classes.loaderBg}>
          <div className={classes.loader}></div>
        </div>
      )}
    </form>
  )
}

export default BaseForm
