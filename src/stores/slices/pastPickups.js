import {createSlice} from '@reduxjs/toolkit';

export const pastPickupsSlice = createSlice({
  name: 'pastPickups',
  initialState: [],
  reducers: {
    setPastPickups: (state, action) => {
      // console.log('setPastPickups');
      state = action.payload;
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setPastPickups} = pastPickupsSlice.actions;

export default pastPickupsSlice.reducer;
