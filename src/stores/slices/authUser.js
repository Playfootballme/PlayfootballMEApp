import {createSlice} from '@reduxjs/toolkit';

export const authUserSlice = createSlice({
  name: 'authUser',
  initialState: {
    data: null,
    jwt: null,
  },
  reducers: {
    setAuthUserData: (state, action) => {
      state.data = action.payload;
      return state;
    },
    setUserImage: (state, action) => {
      // console.log(action.payload);
      state.data.Image.url = action.payload;
      return state;
    },
    setJWT: (state, action) => {
      state.jwt = action.payload;
      return state;
    },
    logout: state => {
      state.data = null;
      state.jwt = null;
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setAuthUserData,
  setJWT,
  setFavouriteCountry,
  logout,
  setUserImage,
} = authUserSlice.actions;

export default authUserSlice.reducer;
