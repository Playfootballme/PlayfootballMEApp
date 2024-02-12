import {createSlice} from '@reduxjs/toolkit';

export const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: [],
  reducers: {
    setBookings: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setBookings} = bookingsSlice.actions;

export default bookingsSlice.reducer;
