import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token:'',
}

export const userSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    tokenAuth: (state,payload) => {
      state.token= payload.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {tokenAuth} = userSlice.actions

export default userSlice.reducer