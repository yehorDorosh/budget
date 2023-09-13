interface Props {
  errors: string | ValidationError[]
}

const ErrorList = ({ errors }: Props) => {
  return (
    <ul className="text-start text-danger">
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
