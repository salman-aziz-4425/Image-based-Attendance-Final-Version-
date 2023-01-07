import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id:' ',
  token:'',
  name:' ',
  qualification:' ',
  image:' ',
  email:' ',
  Auth:false,
  rollNumber:' '
}

export const userSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    tokenAuth: (state,payload) => {
      console.log(payload)
      state.id=payload.payload.id
      state.token= payload.payload.token
      state.name=payload.payload.name
      state.email=payload.payload.email
      state.rollNumber=payload.payload.rollNumber
      state.qualification=payload.payload.qualification
      state.image=payload.payload.image
      state.Auth=payload.payload.Auth
    },
  },
})

// Action creators are generated for each case reducer function
export const {tokenAuth} = userSlice.actions

export default userSlice.reducer