import {createSlice} from '@reduxjs/toolkit';

export const todayMatchesSlice = createSlice({
  name: 'todayMatches',
  initialState: [],
  reducers: {
    setTodayMatches: (state, action) => {
      // Check if the state array is empty
      if (state.length === 0) {
        // If it's empty, set state to action.payload
        state = action.payload;
      } else {
        // If it's not empty, perform updates based on matching id
        const updatedMatches = state.map(match => {
          // Check if the match exists in action.payload by its id
          const matchingMatch = action.payload.find(
            newMatch => newMatch.id === match.id,
          );

          // If a match with the same id is found in action.payload, update it; otherwise, keep the original match
          return matchingMatch ? matchingMatch : match;
        });

        state = updatedMatches;
      }
      return state;
    },
    setMatch: (state, action) => {
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
  },
});

// Action creators are generated for each case reducer function
export const {setTodayMatches, setPlayersOfMatch, setMatch} =
  todayMatchesSlice.actions;

export default todayMatchesSlice.reducer;
