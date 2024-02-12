import {createSlice} from '@reduxjs/toolkit';

export const dropdownCountriesSlice = createSlice({
  name: 'dropdownCountries',
  initialState: [],
  reducers: {
    setDropdownCountries: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setDropdownCountries} = dropdownCountriesSlice.actions;

export default dropdownCountriesSlice.reducer;
