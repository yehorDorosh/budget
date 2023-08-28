interface Props {
  errors: string | ValidationError[]
}

const ErrorList = ({ errors }: Props) => {
  return (
    <ul className="left error">
      {typeof errors === 'string' ? (
        <li>{errors}</li>
      ) : (
        errors.map((item, i) => {
          return <li key={i}>{item.msg}</li>
        })
      )}
    </ul>
  )
}

export default ErrorList
