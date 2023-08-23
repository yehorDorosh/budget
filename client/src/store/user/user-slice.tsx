import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface UserState {
  id: number | null
  email: string | null
  token: string | null
}

const initialState: UserState = {
  id: null,
  email: null,
  token: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<UserState>) {
      state.id = action.payload.id
      state.email = action.payload.email
      state.token = action.payload.token
    }
  }
})

export const userActions = userSlice.actions

export default userSlice.reducer
