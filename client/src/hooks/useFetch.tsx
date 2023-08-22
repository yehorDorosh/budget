import axios from 'axios'
import { useState, useCallback } from 'react'

interface Config {
  method?: string
  payload?: unknown
  contentType?: string
  auth?: string
}

const useFetch = () => {
  const [error, setError] = useState<unknown>()
  const [pending, setPending] = useState(true)

  const sendRequest = useCallback(
    async (url: string, config: Config = { method: 'get', payload: null, contentType: 'application/json', auth: '' }) => {
      setError(undefined)
      setPending(true)
      try {
        const res = await axios({
          method: config.method,
          url,
          data: config.payload,
          headers: {
            'Content-Type': config.contentType,
            Authorization: config.auth
          }
        })
        setPending(false)
        return new Promise((resolve, reject) => {
          resolve(res)
        })
      } catch (err) {
        setError(err)
        setPending(false)
        return new Promise((resolve, reject) => {
          reject(err)
        })
      }
    },
    []
  )

  return { error, pending, sendRequest }
}

export default useFetch
