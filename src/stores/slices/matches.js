import {createSlice} from '@reduxjs/toolkit';

export const matchesSlice = createSlice({
  name: 'matches',
  initialState: [],
  reducers: {
    setMatches: (state, action) => {
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
    setMatch: (state, action) => {
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
    setPlayersOfMatch: (state, action) => {
      // console.log('setPlayersOfMatch');

      const {
        id,
        attributes: {Players},
      } = action.payload;

      const newState = state.map(match => {
        if (match.id === id) {
          return {
            ...match,
            attributes: {
              ...match.attributes,
              Players,
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
export const {setMatches, setPlayersOfMatch, setMatch} = matchesSlice.actions;

export default matchesSlice.reducer;
