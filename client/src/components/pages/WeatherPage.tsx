import { Fragment, useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '../../hooks/useReduxTS'
import { getLastWeather } from '../../store/weather/weather-actions'

const WeatherPage = () => {
  const dispatch = useAppDispatch()
  const weather = useAppSelector((state) => state.weather.weather)

  useEffect(() => {
    // dispatch(getWeather({ id: 1, dateFrom: '2023-09-14 00:00:00', dateTo: '2023-09-14 23:59:59' }))
    dispatch(getLastWeather({}))
  }, [dispatch])

  return (
    <Fragment>
      <h1>Weather Page</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Temperature, C</th>
            <th>Pressure, Pa</th>
            <th>Voltage, V</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {weather &&
            weather.map((w, i) => (
              <tr key={w.dbId}>
                <td>{w.id}</td>
                <td>{w.t}</td>
                <td>{w.p}</td>
                <td>{w.v}</td>
                <td>{new Date(w.regDate).toLocaleString()}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Fragment>
  )
}

export default WeatherPage
