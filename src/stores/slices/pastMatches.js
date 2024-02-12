import {createSlice} from '@reduxjs/toolkit';

export const pastMatchesSlice = createSlice({
  name: 'pastMatches',
  initialState: {
    count: 0,
    entities: [],
  },
  reducers: {
    setPastMatches: (state, action) => {
      state.entities = action.payload;
      return state;
    },

    setPlayersOfPastMatch: (state, action) => {
      const {
        id,
        attributes: {Players},
      } = action.payload;

      const newState = state.entities.map(match => {
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

      state.entities = newState;
      return state;
    },
    setPastMatch: (state, action) => {
      const {id, attributes} = action.payload;
      const newState = state.entities.map(match => {
        if (match.id === id) {
          return {
            ...match,
            attributes,
          };
        }
        return match;
      });

      state.entities = newState;
      return state;
    },
    setPastMatchesCount: (state, action) => {
      state.count = action.payload;
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setPastMatches,
  setPlayersOfPastMatch,
  setPastMatchesCount,
  setPastMatch,
} = pastMatchesSlice.actions;

export default pastMatchesSlice.reducer;
