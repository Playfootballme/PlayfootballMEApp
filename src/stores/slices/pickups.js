import {createSlice} from '@reduxjs/toolkit';

export const pickupsSlice = createSlice({
  name: 'pickups',
  initialState: [],
  reducers: {
    setUpcomingPickups: (state, action) => {
      // console.log('setUpcomingPickups');

      state = action.payload;
      return state;
    },
    setPickup: (state, action) => {
      const {id, attributes} = action.payload;

      const newState = state.map(match => {
        if (match.id === id) {
          return {
            ...match,
            attributes,
          };
        }
        return match;
      });

      return newState;
    },
    setPlayersOfPickup: (state, action) => {
      // console.log('setPlayersOfPickup');

      const {id, attributes} = action.payload;

      const newState = state.map(match => {
        if (match.id === id) {
          return {
            ...match,
            attributes: {
              ...match.attributes,
              TeamA: attributes.TeamA,
              TeamAPublic: attributes.TeamAPublic,
              TeamAUID: attributes.TeamAUID,
              TeamB: attributes.TeamB,
              TeamBPublic: attributes.TeamBPublic,
              TeamBUID: attributes.TeamBUID,
              TeamC: attributes.TeamC,
              TeamCPublic: attributes.TeamCPublic,
              TeamCUID: attributes.TeamCUID,
              TeamD: attributes.TeamD,
              TeamDPublic: attributes.TeamDPublic,
              TeamDUID: attributes.TeamDUID,
            },
          };
        }
        return match;
      });

      return newState;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setUpcomingPickups, setPlayersOfPickup, setPickup} =
  pickupsSlice.actions;

export default pickupsSlice.reducer;
