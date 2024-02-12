import {createSlice} from '@reduxjs/toolkit';

export const countrySlice = createSlice({
  name: 'country',
  initialState: {
    currency: 'JOD',
    code: 'JO',
    timezone: 3,
  },
  reducers: {
    setCurrency: (state, action) => {
      state.currency = action.payload;
      return state;
    },
    setCountry: (state, action) => {
      state.code = action.payload;
      return state;
    },
    setTimezone: (state, action) => {
      state.timezone = action.payload;
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setCurrency, setCountry, setTimezone} = countrySlice.actions;

export default countrySlice.reducer;
