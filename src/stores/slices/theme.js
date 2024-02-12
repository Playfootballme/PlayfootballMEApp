import {createSlice} from '@reduxjs/toolkit';

export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    available: [
      {
        label: 'Light',
        value: 'light',
      },
      {
        label: 'Dark',
        value: 'dark',
      },
    ],
    current: 'dark',
  },
  reducers: {
    setTheme: (state, action) => {
      state.current = action.payload;
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setTheme} = themeSlice.actions;

export default themeSlice.reducer;
