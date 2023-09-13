import React, { FC, Fragment } from 'react'

import classes from './BaseForm.module.scss'
import ErrorList from '../ErrorList/ErrorList'

interface BaseFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
  isLoading: boolean
  errors?: string | ValidationError[]
  className?: string
}

const BaseForm: FC<BaseFormProps> = ({ children, isLoading, errors, className, ...props }) => {
  return (
    <Fragment>
      <form className={[classes.form, className].join(' ')} {...props} noValidate={true}>
        {errors && <ErrorList errors={errors} />}
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
