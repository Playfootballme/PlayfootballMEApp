import {createSlice} from '@reduxjs/toolkit';
import {t} from 'i18next';
export const languageSlice = createSlice({
  name: 'language',
  initialState: {
    available: [
      {
        label: 'English',
        value: 'en',
      },
      {
        label: 'Arabic',
        value: 'ar',
      },
    ],
    current: 'en',
  },
  reducers: {
    setLanguage: (state, action) => {
      state.current = action.payload;
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setLanguage} = languageSlice.actions;

export default languageSlice.reducer;
