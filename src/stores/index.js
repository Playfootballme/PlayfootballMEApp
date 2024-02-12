import matchesSlice from './slices/matches';
import todayMatchesSlice from './slices/todayMatches';
import pastMatchesSlice from './slices/pastMatches';
import tournamentsSlice from './slices/tournaments';
import pastTournamentsSlice from './slices/pastTournaments';
import pickupsSlice from './slices/pickups';
import pastPickupsSlice from './slices/pastPickups';
import countrySlice from './slices/country';
import languageSlice from './slices/language';
import themeSlice from './slices/theme';
import bookingsSlice from './slices/bookings';
import authUserSlice from './slices/authUser';
import registrationStepsSlice from './slices/registrationSteps';
import announcementsSlice from './slices/announcements';
import dropdownCountriesSlice from './slices/dropdownCountries';
import applyInfoSlice from './slices/applyInfo';

import {configureStore} from '@reduxjs/toolkit';

export default configureStore({
  reducer: {
    matches: matchesSlice,
    todayMatches: todayMatchesSlice,
    pastMatches: pastMatchesSlice,
    tournaments: tournamentsSlice,
    pastTournaments: pastTournamentsSlice,
    pickups: pickupsSlice,
    pastPickups: pastPickupsSlice,
    country: countrySlice,
    language: languageSlice,
    theme: themeSlice,
    bookings: bookingsSlice,
    authUser: authUserSlice,
    registrationSteps: registrationStepsSlice,
    announcements: announcementsSlice,
    dropdownCountries: dropdownCountriesSlice,
    applyInfo: applyInfoSlice,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});
