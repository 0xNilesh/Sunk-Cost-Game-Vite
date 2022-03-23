import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  address : ""
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state,action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.address = action.payload
    },
    logout: (state) => {
      state.address = ""
    },
  },
})

// Action creators are generated for each case reducer function
export const { login , logout } = userSlice.actions

export default userSlice.reducer