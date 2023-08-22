import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: null,
    email: null,
    token: null
  },
  reducers: {
    setUserData(state, action) {
      state.id = action.payload.id
      state.email = action.payload.email
      state.token = action.payload.token
    }
  }
})

export const userActions = userSlice.actions

export default userSlice.reducer
