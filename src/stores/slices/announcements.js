import {createSlice} from '@reduxjs/toolkit';

export const announcementsSlice = createSlice({
  name: 'announcements',
  initialState: [],
  reducers: {
    setAnnouncements: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setAnnouncements} = announcementsSlice.actions;

export default announcementsSlice.reducer;
