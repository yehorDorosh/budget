export const emailValidator = (value: string): boolean => {
  const isValid = String(value)
    .trim()
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  return !!isValid
}

export const passwordValidator = (value: string): boolean => {
  const isValid = String(value)
    .trim()
    .match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
  return !!isValid
}

export const notEmptyValidator = (value: string): boolean => {
  const isValid = String(value).trim().length > 0
  return isValid
}

export const shouldMatchValidator = (value: string, matchValue: string): boolean => {
  const isValid = String(value).trim() === String(matchValue).trim() && String(value).trim().length > 0
  return isValid
}
