import {createSlice} from '@reduxjs/toolkit';

export const pastTournamentsSlice = createSlice({
  name: 'pastTournaments',
  initialState: {
    count: 0,
    entities: [],
  },
  reducers: {
    setPastTournaments: (state, action) => {
      // console.log('setpastTournaments');
      state.entities = action.payload;
      return state;
    },

    setPlayersOfPastTournaments: (state, action) => {
      // console.log('setPlayersOfMatch');

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

    setPastTournament: (state, action) => {
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

    setPastTournamentsCount: (state, action) => {
      // console.log('setpastTournaments');
      state.count = action.payload;
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setPastTournaments,
  setPlayersOfPastTournaments,
  setPastTournamentsCount,
  setPastTournament,
} = pastTournamentsSlice.actions;

export default pastTournamentsSlice.reducer;
