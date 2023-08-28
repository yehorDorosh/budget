import React, { FC, Fragment } from 'react'

import classes from './BaseForm.module.scss'
import ErrorList from '../ErrorList/ErrorList'

interface BaseFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
  isLoading: boolean
  errors?: string | ValidationError[]
}

const BaseForm: FC<BaseFormProps> = ({ children, isLoading, errors, ...props }) => {
  return (
    <Fragment>
      {errors && <ErrorList errors={errors} />}
      <form className={classes.form} {...props}>
        {children}
        {isLoading && (
          <div className={classes.loaderBg}>
            <div className={classes.loader}></div>
          </div>
        )}
      </form>
    </Fragment>
  )
}

export default BaseForm
