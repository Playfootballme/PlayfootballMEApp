import axios from 'axios';
import {setMatches, setMatch} from '@stores/slices/matches';

import {setTournaments, setTournament} from '@stores/slices/tournaments';

import {setAuthUserData} from '@stores/slices/authUser';
import {setAnnouncements} from '@stores/slices/announcements';
import {apiEndpoint} from '@config/functions';
import moment from 'moment';

const qs = require('qs');

export const fetchTodayAndTomorrowMatches =
  (country, page) => async dispatch => {
    // Cancel any ongoing request before making a new one

    try {
      const response = await axios.get(
        `${apiEndpoint}/find-today-tomorrow-matches?country=${country}&page=${page}`,
      );

      if (response.status === 200) {
        dispatch(setMatches(response.data));
      }
    } catch (error) {
      // Handle Axios error
      if (error.response) {
        // The request was made, but the server responded with a non-2xx status code
        console.error(
          `Request failed with status code ${error.response.status}`,
        );
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made, but no response was received (e.g., network error)
        console.error('No response received:', error.request);
      } else {
        // Something else went wrong while setting up the request
        console.error('Error setting up the request:', error.message);
      }
      // Handle the error as needed (e.g., show a user-friendly message)
    }
  };

export const fetchMatchesByDate = (country, page, date) => async dispatch => {
  // Cancel any ongoing request before making a new one

  const dateToMoment = moment(date).locale('en-gb').format('YYYY-MM-DD');
  console.log(dateToMoment);

  try {
    const response = await axios.get(
      `${apiEndpoint}/find-matches-by-date?country=${country}&page=${page}&date=${dateToMoment}`,
    );

    if (response.status === 200) {
      dispatch(setMatches(response.data));
      return response.data.length;
    }
  } catch (error) {
    // Handle Axios error
    if (error.response) {
      // The request was made, but the server responded with a non-2xx status code
      console.error(`Request failed with status code ${error.response.status}`);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made, but no response was received (e.g., network error)
      console.error('No response received:', error.request);
    } else {
      // Something else went wrong while setting up the request
      console.error('Error setting up the request:', error.message);
    }
    // Handle the error as needed (e.g., show a user-friendly message)
  }
};

export const fetchMatch = id => async dispatch => {
  const response = await axios.get(`${apiEndpoint}/find-match-by-id?ID=${id}`);

  if (response.status === 200) {
    dispatch(setMatch({id: id, data: response.data}));
  }
};

export const fetchMe = jwt => async dispatch => {
  // Cancel any ongoing request before making a new one

  const query = qs.stringify(
    {
      populate: ['*'],
    },
    {
      encodeValuesOnly: true, // prettify URL
    },
  );

  const response = await axios.get(`${apiEndpoint}/users/me?${query}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  const data = await response;
  if (data.status === 200) {
    dispatch(setAuthUserData(data.data));
  }
};
export const fetchAnnouncements = (country, lang) => async dispatch => {
  // Cancel any ongoing request before making a new one

  const query = qs.stringify(
    {
      locale: lang,
      filters: {
        Country: {
          $eq: country,
        },
      },
      populate: ['Image'],
      sort: ['weight:ASC'],
    },
    {
      encodeValuesOnly: true, // prettify URL
    },
  );

  try {
    const response = await axios.get(`${apiEndpoint}/home-banners?${query}`);
    const data = await response;
    if (data.status === 200) {
      dispatch(setAnnouncements(data.data.data));
    }
  } catch (error) {
    dispatch(setAnnouncements(error.response.data.data));
  }
};

export const fetchUpcomingTournaments = (country, page) => async dispatch => {
  // Cancel any ongoing request before making a new one

  try {
    const response = await axios.get(
      `${apiEndpoint}/find-upcoming-tournaments?country=${country}&page=${page}`,
    );

    if (response.status === 200) {
      dispatch(setTournaments(response.data));
    }
  } catch (error) {
    // Handle Axios error
    if (error.response) {
      // The request was made, but the server responded with a non-2xx status code
      console.error(`Request failed with status code ${error.response.status}`);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made, but no response was received (e.g., network error)
      console.error('No response received:', error.request);
    } else {
      // Something else went wrong while setting up the request
      console.error('Error setting up the request:', error.message);
    }
    // Handle the error as needed (e.g., show a user-friendly message)
  }
};

export const fetchPastTournaments = (country, page) => async dispatch => {
  // Cancel any ongoing request before making a new one

  try {
    const response = await axios.get(
      `${apiEndpoint}/find-past-tournaments?country=${country}&page=${page}`,
    );

    if (response.status === 200) {
      dispatch(setTournaments(response.data));
    }
  } catch (error) {
    // Handle Axios error
    if (error.response) {
      // The request was made, but the server responded with a non-2xx status code
      console.error(`Request failed with status code ${error.response.status}`);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made, but no response was received (e.g., network error)
      console.error('No response received:', error.request);
    } else {
      // Something else went wrong while setting up the request
      console.error('Error setting up the request:', error.message);
    }
    // Handle the error as needed (e.g., show a user-friendly message)
  }
};

export const fetchTournament = id => async dispatch => {
  const response = await axios.get(
    `${apiEndpoint}/find-tournament-by-id?ID=${id}`,
  );

  if (response.status === 200) {
    dispatch(setTournament({id: id, data: response.data}));
  }
};
