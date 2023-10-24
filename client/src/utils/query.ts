function objectToQueryString(obj: { [key: string | number]: any }, blackList: string[] = []) {
  const filteredObj = Object.keys(obj).reduce((acc, key) => {
    if (blackList.includes(key)) return acc
    return { ...acc, [key]: obj[key] }
  }, {})
  return Object.keys(filteredObj)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&')
}

export default objectToQueryString
