import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Weather {
  dbId: number
  id: 'string'
  t: number
  p: number
  v: number | null
  regDate: string
}

export interface WeatherState {
  weather: Weather[]
}

const initialState: WeatherState = {
  weather: []
}

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setWeather(state, action: PayloadAction<Weather[]>) {
      state.weather = action.payload
    }
  }
})

export const weatherActions = weatherSlice.actions

export default weatherSlice.reducer
