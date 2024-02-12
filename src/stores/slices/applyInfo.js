import {createSlice} from '@reduxjs/toolkit';

export const applyInfoSlice = createSlice({
  name: 'applyInfo',
  initialState: {
    FirstName: null,
    LastName: null,
    Email: null,
    Phone: null,
    CurrentCountry: null,
    CurrentCity: null,
    Role: null,
    Age: null,
    DOB: null,
    Gender: null,
    CurrentJob: null,
  },
  reducers: {
    setApplyInfo: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setApplyInfo} = applyInfoSlice.actions;

export default applyInfoSlice.reducer;
