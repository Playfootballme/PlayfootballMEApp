import {createSlice} from '@reduxjs/toolkit';

export const tournamentsSlice = createSlice({
  name: 'tournaments',
  initialState: [],
  reducers: {
    setTournaments: (state, action) => {
      const newState = [...state];

      action.payload.forEach(newMatch => {
        // Check if the new match with the same id already exists in state
        const existingMatchIndex = newState.findIndex(
          match => match.id === newMatch.id,
        );

        if (existingMatchIndex === -1) {
          // If it doesn't exist, add the new match to the state
          newState.push(newMatch);
        } else {
          // If it exists, update the existing match with the new data
          newState[existingMatchIndex] = newMatch;
        }
      });

      return newState;
    },
    setTournament: (state, action) => {
      const {id, data} = action.payload;
      const newState = [...state];
      const existingMatchIndex = newState.findIndex(match => match.id === id);

      if (existingMatchIndex === -1) {
        // If it doesn't exist, add the new match to the state
        newState.push(data);
      } else {
        // If it exists, update the existing match with the new data
        newState[existingMatchIndex] = data;
      }

      return newState;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setTournaments, setTournament} = tournamentsSlice.actions;

export default tournamentsSlice.reducer;
