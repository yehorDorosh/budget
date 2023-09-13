import React, { FC } from 'react'

interface Props {
  className?: string
  children: React.ReactNode
}

const BaseCard: FC<Props> = ({ children, className, ...rest }) => {
  return (
    <div className={`card ${className}`} {...rest}>
      <div className="card-body">{children}</div>
    </div>
  )
}

export default BaseCard
