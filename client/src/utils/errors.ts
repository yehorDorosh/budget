import axios from 'axios'

export function errorHandler(err: any) {
  if (axios.isAxiosError(err) && err.response) {
    return { errorMsg: err.message, data: err.response.data, status: err.response.status }
  }
  return { error: err }
}
