import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface UserState {
  id: number | null
  email: string | null
  token: string | null
  isLogin?: boolean | null
}

const initialState: UserState = {
  id: null,
  email: null,
  token: null,
  isLogin: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<UserState>) {
      state.id = action.payload.id
      state.email = action.payload.email
      if (action.payload.token) state.token = action.payload.token
    },
    login(state) {
      state.isLogin = true
    },
    logout(state) {
      state.isLogin = false
      state.id = null
      state.email = null
      state.token = null
    }
  }
})

export const userActions = userSlice.actions

export default userSlice.reducer
