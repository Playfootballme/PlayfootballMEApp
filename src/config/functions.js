import axios from 'axios';
import qs from 'qs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

export const apiEndpoint = 'https://app.playfootballjo.com/api';
export const rootURL = 'https://app.playfootballjo.com';

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&-_.])[\w@$#!%*?&-_.]*$/;

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
import {mode} from '@env';

export const getData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // value previously stored
      return JSON.parse(value);
    }
  } catch (e) {
    // error reading value
    // console.log('getData error', e);
  }
};

export const removeData = async key => {
  try {
    const response = await AsyncStorage.removeItem(key);

    // value previously stored
    return response;
  } catch (e) {
    // error reading value
    // console.log('removeData error', e);
  }
};

export const storeData = async (key, value) => {
  try {
    const response = await AsyncStorage.setItem(key, value);
    return response;
  } catch (e) {
    // saving error
    console.log('storeData error', e);
  }
};

export const LoginUser = async (identifier, password) => {
  const params = {
    identifier: identifier.toLowerCase(),
    password,
  };
  try {
    const response = await axios.post(`${apiEndpoint}/auth/local`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log(err.response.data);

      return {data: err.response.data, status: err.response.status};
    }

    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('Error response.data', err.response.data);
      console.log('Error response.status', err.response.status);
      console.log('Error response.headers', err.response.headers);
    } else if (err.request) {
      /*
       * The request was made but no response was received, `err.request`
       * is an instance of XMLHttpRequest in the browser and an instance
       * of http.ClientRequest in Node.js
       */
      console.log('Error request', err.request);
    } else {
      // Something happened in setting up the request and triggered an Error
      console.log('Error message', err.message);
    }
    console.log('Error config', err.config);
  }
};

export const EmailValidity = email => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

export const EmailAvailability = async email => {
  const query = qs.stringify(
    {
      filters: {
        email: {
          $eqi: email,
        },
      },
    },
    {
      encodeValuesOnly: true, // prettify URL
    },
  );
  try {
    const response = await axios.get(`${apiEndpoint}/users?${query}`, {});
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log(err.response.data);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const FindUserByEmail = async email => {
  const query = qs.stringify(
    {
      filters: {
        email: {
          $eqi: email,
        },
      },
      populate: ['Image'],
    },
    {
      encodeValuesOnly: true, // prettify URL
    },
  );
  try {
    const response = await axios.get(
      `${apiEndpoint}/users?filters[email][$eqi]=${email}&populate[0]=Image`,
    );
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log(err.response.data);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const PhoneAvailability = async phone => {
  const query = qs.stringify(
    {
      filters: {
        Phone: {
          $eqi: phone,
        },
      },
    },
    {
      encodeValuesOnly: true, // prettify URL
    },
  );
  try {
    const response = await axios.get(`${apiEndpoint}/users?${query}`, {});
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log(err.response.data);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const InitUser = async email => {
  let params = {
    email: email.toLowerCase(),
  };

  try {
    const response = await axios.post(
      `${apiEndpoint}/users-permissions/register-and-verify`,
      params,
    );
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('initUser error', err.response);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const ReInitUser = async (email, id) => {
  let params = {
    email: email.toLowerCase(),
    id,
  };

  try {
    const response = await axios.put(
      `${apiEndpoint}/users-permissions/re-register-and-verify`,
      params,
    );
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('initUser error', err.response);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const ConfirmUser = async (id, email) => {
  let params = {
    id,
    email,
  };

  try {
    const response = await axios.put(
      `${apiEndpoint}/users-permissions/confirm-user`,
      params,
    );
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('err.response', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const DeleteUser = async (id, jwt) => {
  let params = {
    id,
  };

  try {
    const response = await axios.post(
      `${apiEndpoint}/users-permissions/delete-user`,
      params,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('err.response', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const ResetPassword = async (id, email) => {
  let params = {
    id,
    email,
  };

  try {
    const response = await axios.put(
      `${apiEndpoint}/users-permissions/reset-password-and-verify`,
      params,
    );
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('err.response', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const UpdateUser = async (
  id,
  jwt,
  email,
  username,
  password,
  FirstName,
  LastName,
  Phone,
  EmergencyPhone,
  dob,
  PreferredPosition,
  Gender,
) => {
  let params = {
    email: email.toLowerCase().trim(),
    username: username.toLowerCase().trim(),
    password,
    FirstName,
    LastName,
    Phone,
    EmergencyPhone,
    dob,
    Gender,
    PreferredPosition,
    confirmed: true,
  };

  try {
    const response = await axios.put(`${apiEndpoint}/users/${id}`, params, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const data = await response;
    return {data: data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('err.response', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const SendWelcomeEmail = async (id, email, jwt) => {
  let params = {
    id,
    email,
  };

  try {
    const response = await axios.post(
      `${apiEndpoint}/users-permissions/send-welcome-email`,
      params,
    );
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('err.response', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const UpdateName = async (id, jwt, FirstName, LastName) => {
  let params = {
    FirstName,
    LastName,
  };

  try {
    const response = await axios.put(`${apiEndpoint}/users/${id}`, params, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const data = await response;
    return {data: data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('err.response', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const UpdateUsername = async (id, jwt, username) => {
  let params = {
    username: username.toLowerCase(),
  };

  try {
    const response = await axios.put(`${apiEndpoint}/users/${id}`, params, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const data = await response;
    return {data: data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('err.response', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const UpdatePassword = async (id, password) => {
  let params = {
    password,
  };

  try {
    const response = await axios.put(`${apiEndpoint}/users/${id}`, params, {});
    const data = await response;
    return {data: data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('err.response', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const UpdatePhone = async (id, jwt, Phone) => {
  let params = {
    Phone,
  };

  try {
    const response = await axios.put(`${apiEndpoint}/users/${id}`, params, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const data = await response;
    return {data: data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('err.response', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const UpdateEmergencyPhone = async (id, jwt, EmergencyPhone) => {
  let params = {
    EmergencyPhone,
  };

  try {
    const response = await axios.put(`${apiEndpoint}/users/${id}`, params, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const data = await response;
    return {data: data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('err.response', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const UpdateAge = async (id, jwt, Age) => {
  let params = {
    Age,
  };

  try {
    const response = await axios.put(`${apiEndpoint}/users/${id}`, params, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const data = await response;
    return {data: data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('err.response', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const UpdateDOB = async (id, jwt, dob) => {
  let params = {
    dob,
    Age: calculateAge(dob),
  };

  try {
    const response = await axios.put(`${apiEndpoint}/users/${id}`, params, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const data = await response;
    return {data: data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('err.response', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const UpdateGender = async (id, jwt, Gender) => {
  let params = {
    Gender,
  };

  try {
    const response = await axios.put(`${apiEndpoint}/users/${id}`, params, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const data = await response;
    return {data: data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('err.response', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const UpdatePreferredPosition = async (id, jwt, PreferredPosition) => {
  let params = {
    PreferredPosition,
  };

  try {
    const response = await axios.put(`${apiEndpoint}/users/${id}`, params, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const data = await response;
    return {data: data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('err.response', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const MakeUserAbsent = async (id, jwt, AbsentLastMatch) => {
  let params = {
    AbsentLastMatch: !AbsentLastMatch,
  };

  try {
    const response = await axios.put(`${apiEndpoint}/users/${id}`, params, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const data = await response;
    return {data: data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('err.response', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const UpdateGuests = async (id, jwt, Guests) => {
  let params = {
    Guests,
  };

  try {
    const response = await axios.put(`${apiEndpoint}/users/${id}`, params, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const data = await response;
    return {data: data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('err.response', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const UsernameAvailability = async username => {
  const query = qs.stringify(
    {
      filters: {
        username: {
          $eqi: username,
        },
      },
    },
    {
      encodeValuesOnly: true, // prettify URL
    },
  );
  try {
    const response = await axios.get(`${apiEndpoint}/users?${query}`, {});
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log(err.response.data);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const UpdateProfilePicture = async (id, jwt, Image) => {
  let params = {
    Image,
  };

  const query = qs.stringify(
    {
      populate: ['Image'],
    },
    {
      encodeValuesOnly: true, // prettify URL
    },
  );

  try {
    const response = await axios.put(
      `${apiEndpoint}/users/${id}?${query}`,
      params,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const data = await response;
    return {data: data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('err.response', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const UpdateFCM = async (id, jwt, fcm, country) => {
  let params = {
    id,
    fcm,
    currentCountry: country,
  };

  try {
    const response = await axios.put(`${apiEndpoint}/users/${id}`, params, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('err.response UpdateFCM', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const FetchMe = async jwt => {
  try {
    const query = qs.stringify(
      {
        populate: ['Image', 'Guests.Image'],
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
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('Fetch Me error', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

// match
export const FetchMatch = async (country, match) => {
  // Cancel any ongoing request before making a new one

  const query = qs.stringify(
    {
      filters: {
        Location: {
          Country: {
            $eq: country,
          },
        },
        dev_mode: {
          $eq: mode === 'dev',
        },
        CancelGame: {
          $eq: false,
        },
      },
      sort: ['StartDate:desc'],
      populate: [
        'Image',
        'Location.Facilities',
        'Location.Image',
        'localizations',
        'Players.Player.Image',
        'Players.Player',
        'WaitingList.Player',
      ],
    },
    {
      encodeValuesOnly: true, // prettify URL
    },
  );

  try {
    const response = await axios.get(
      `${apiEndpoint}/matches/${match}?${query}`,
    );
    const data = await response;
    if (data.status === 200) {
      return data.data.data;
    }
  } catch (e) {
    console.log(e);
  }
};

export const JoinMatch = async (
  playerID,
  matchID,
  jwt,
  isGK = false,
  timeZone,
) => {
  let params = {
    player: playerID,
    match: matchID,
    isGK,
    timeZone,
  };

  try {
    const response = await axios.put(
      `${apiEndpoint}/join-match`,
      {data: params},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const data = await response;
    // console.log(data);
    return {data: data.data, status: data.status};
  } catch (err) {
    console.log('JoinMatch err', err);
    // Error 😨
    if (err.response) {
      console.log('JoinMatch err.response', err.response);

      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('JoinMatch error', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const JoinMatchWaitingList = async (playerID, matchID, jwt) => {
  let params = {
    player: playerID,
    match: matchID,
  };

  try {
    const response = await axios.put(
      `${apiEndpoint}/join-match-waiting-list`,
      {data: params},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log(err);
      console.log('JoinMatch error', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const LeaveMatch = async (playerID, matchID, jwt, timeZone, banUser) => {
  let params = {
    player: playerID,
    match: matchID,
    timeZone,
    banUser,
  };

  try {
    const response = await axios.put(
      `${apiEndpoint}/leave-match`,
      {data: params},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('LeaveMatch error', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const TogglePaidMatch = async (
  playerID,
  isPaidUsingCredit = false,
  cashAmount,
  walletAmount,
  returnAmount,
  onlineAmount,
  matchID,
  jwt,
) => {
  let params = {
    player: playerID,
    match: matchID,
    isPaidUsingCredit,
    cashAmount,
    walletAmount,
    returnAmount,
    onlineAmount,
  };

  try {
    const response = await axios.put(
      `${apiEndpoint}/toggle-paid-match`,
      {data: params},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('LeaveMatch error', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const AddMatchExpenses = async (match, expenses, jwt) => {
  let params = {
    match,
    expenses,
  };

  try {
    const response = await axios.put(
      `${apiEndpoint}/add-match-expense`,
      {data: params},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('LeaveMatch error', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const SendMatchSummary = async (match, jwt) => {
  let params = {
    match,
  };

  try {
    const response = await axios.post(
      `${apiEndpoint}/send-match-summary`,
      {data: params},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('LeaveMatch error', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const FindMatchesStats = async (player, country, jwt) => {
  try {
    const response = await axios.get(
      `${apiEndpoint}/find-matches-stats?player=${player}&country=${country}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log(err);
      console.log('JoinMatch error', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const FindMatchesOfPlayer = async (player, country, jwt) => {
  try {
    const response = await axios.get(
      `${apiEndpoint}/find-matches-of-player?player=${player}&country=${country}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log(err);
      console.log('FindMatchesOfPlayer error', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const UpdatePlayerState = async (match, player, stats, jwt) => {
  try {
    let params = {
      player,
      match,
      stats,
    };
    const response = await axios.put(
      `${apiEndpoint}/update-player-stats`,
      {data: params},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log(err);
      console.log('FindMatchesOfPlayer error', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const FindNearestMatchDate = async country => {
  // Cancel any ongoing request before making a new one

  try {
    const response = await axios.get(
      `${apiEndpoint}/find-nearest-match?country=${country}`,
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    console.log(e);
  }
};

export const FindNearestMatchDates = async country => {
  // Cancel any ongoing request before making a new one

  try {
    const response = await axios.get(
      `${apiEndpoint}/find-nearest-matches?country=${country}`,
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    console.log(e);
  }
};

// tournaments
export const FetchTournament = async (country, match) => {
  // Cancel any ongoing request before making a new one

  const query = qs.stringify(
    {
      filters: {
        Location: {
          Country: {
            $eq: country,
          },
        },
        dev_mode: {
          $eq: mode === 'dev',
        },
        CancelGame: {
          $eq: false,
        },
      },
      sort: ['StartDate:desc'],
      populate: [
        'Image',
        'Location.Facilities',
        'Location.Image',
        'localizations',
        'Players.Player.Image',
        'Players.Player',
        'WaitingList.Player',
      ],
    },
    {
      encodeValuesOnly: true, // prettify URL
    },
  );

  try {
    const response = await axios.get(
      `${apiEndpoint}/tournaments/${match}?${query}`,
    );
    const data = await response;
    if (data.status === 200) {
      return data.data.data;
    }
  } catch (e) {
    console.log(e);
  }
};
export const JoinTournament = async (playerID, matchID, jwt) => {
  let params = {
    player: playerID,
    tournament: matchID,
  };

  try {
    const response = await axios.put(
      `${apiEndpoint}/join-tournament`,
      {data: params},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const data = await response;
    // console.log(data);
    return {data: data.data, status: data.status};
  } catch (err) {
    console.log('Jointournament err', err);
    // Error 😨
    if (err.response) {
      console.log('Jointournament err.response', err.response);

      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('Jointournament error', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const JoinTournamentWaitingList = async (playerID, matchID, jwt) => {
  let params = {
    player: playerID,
    tournament: matchID,
  };

  try {
    const response = await axios.put(
      `${apiEndpoint}/join-tournament-waiting-list`,
      {data: params},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log(err);
      console.log('Jointournament error', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const FindTournamentOfPlayer = async (player, country, jwt) => {
  try {
    const response = await axios.get(
      `${apiEndpoint}/find-tournament-of-player?player=${player}&country=${country}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log(err);
      console.log(
        'FindTournamentOfPlayer error',
        err.response.data.error.details,
      );

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const LeaveTournament = async (playerID, matchID, jwt) => {
  let params = {
    player: playerID,
    tournament: matchID,
  };

  try {
    const response = await axios.put(
      `${apiEndpoint}/leave-tournament`,
      {data: params},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('Leavetournament error', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const TogglePaidTournament = async (
  playerID,
  isPaidUsingCredit = false,
  cashAmount,
  walletAmount,
  returnAmount,
  onlineAmount,
  matchID,
  jwt,
) => {
  let params = {
    player: playerID,
    tournament: matchID,
    isPaidUsingCredit,
    cashAmount,
    walletAmount,
    returnAmount,
    onlineAmount,
  };

  try {
    const response = await axios.put(
      `${apiEndpoint}/toggle-paid-tournament`,
      {data: params},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('LeaveMatch error', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const AddTournamentExpenses = async (match, expenses, jwt) => {
  let params = {
    match,
    expenses,
  };

  try {
    const response = await axios.put(
      `${apiEndpoint}/add-tournament-expense`,
      {data: params},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('LeaveMatch error', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

// pickup
export const JoinPickup = async (team, playerID, matchID, jwt, isPublic) => {
  let params = {
    team: team,
    player: playerID,
    match: matchID,
    isPublic,
  };

  try {
    const response = await axios.put(
      `${apiEndpoint}/join-pickup`,
      {data: params},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('JoinPickup error', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const JoinPickupWaitingList = async (team, playerID, matchID, jwt) => {
  let params = {
    team: team,
    player: playerID,
    match: matchID,
  };

  try {
    const response = await axios.put(
      `${apiEndpoint}/join-pickup-waiting-list`,
      {data: params},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log(
        'JoinPickupWaitingList error',
        err.response.data.error.details,
      );

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const LeavePickup = async (playerID, matchID, jwt) => {
  let params = {
    player: playerID,
    match: matchID,
  };

  try {
    const response = await axios.put(
      `${apiEndpoint}/leave-pickup`,
      {data: params},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('LeavePickup error', err.response.data);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

//upload files
export const UploadFile = async (files, jwt) => {
  const formData = new FormData();

  // formData.append("files", file);
  files.forEach(file => formData.append('files', file, file.name));

  // console.log('err formData', formData);
  await fetch(apiEndpoint + '/upload', {
    method: 'post',
    body: formData,
    headers: {Authorization: `Bearer ${jwt}`},
  })
    .then(response => response.json())
    .then(data => {
      // Handle the response data
      // console.log('Upload response:', data);
      return data;
    })
    .catch(error => {
      // Handle any errors
      console.error('Upload error:', error);
    });
  // try {
  //   // await axios
  //   //   .post(apiEndpoint + '/upload', formData, {
  //   //     headers: {
  //   //       Authorization: `Bearer ${jwt}`,
  //   //     },
  //   //   })
  //   //   .then(data => console.log(data));

  //   // console.log(response);

  //   // await fetch(apiEndpoint + '/upload', {
  //   //   method: 'post',
  //   //   body: formData,
  //   //   headers: {Authorization: `Bearer ${jwt}`},
  //   // });

  //   // const data = await response;

  //   // return {data: data.data, status: data.status};
  // } catch (err) {
  //   console.log(err);
  //   // Error 😨
  //   if (err.response) {
  //     /*
  //      * The request was made and the server responded with a
  //      * status code that falls out of the range of 2xx
  //      */
  //     console.log('upload error', err.response.data);

  //     return {data: err.response.data, status: err.response.status};
  //   }
  // }
};

export const RemoveFile = async (ID, jwt) => {
  try {
    const response = axios.delete(apiEndpoint + '/upload/files/' + ID, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('remove error', err.response.data);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

function calculateAge(dateOfBirth) {
  // Parse the date of birth using Moment.js
  const dob = moment(dateOfBirth);

  // Get the current date
  const now = moment();

  // Calculate the difference in years
  const age = now.diff(dob, 'years');

  return age;
}
export const JoinUs = async applyObj => {
  let params = {
    FirstName: applyObj.FirstName.trim(),
    LastName: applyObj.LastName.trim(),
    Phone: applyObj.Phone.trim(),
    Email: applyObj.Email.trim().toLowerCase(),
    CurrentJob: applyObj.CurrentJob.trim(),
    dob: applyObj.DOB,
    Age: calculateAge(applyObj.DOB),
    CurrentCountry: applyObj.CurrentCountry,
    CurrentCity: applyObj.CurrentCity.trim(),
    Role: applyObj.Role,
    Gender: applyObj.Gender,
  };

  try {
    const response = await axios.post(`${apiEndpoint}/job-applications`, {
      data: params,
    });
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('LeavePickup error', err.response.data);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

//  wallets
export const GetWalletByUserID = async (id, jwt, country = 'JO') => {
  try {
    const query = qs.stringify(
      {
        filters: {
          Player: id,
          Country: country,
        },
        populate: [
          'TransactionsHistory.Participant.Image',
          'TransactionsHistory.Participant.role',
        ],
      },
      {
        encodeValuesOnly: true, // prettify URL
      },
    );

    const response = await axios.get(`${apiEndpoint}/wallets?${query}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('Fetch Me error', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const CreateWallet = async (player, currency, country, jwt) => {
  const params = {
    player,
    currency,
    country,
  };
  try {
    const response = await axios.post(
      `${apiEndpoint}/create-wallet`,
      {data: params},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );

    // Extract data and status directly from the response
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('CreateWallet error', err.response.data);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const AddTransaction = async (
  walletID,
  participant,
  type,
  amount,
  matchID,
  matchType,
  jwt,
  cashPaid = 0,
) => {
  const params = {
    walletID,
    participant,
    type,
    amount,
    matchID,
    matchType,
    cashPaid,
  };
  try {
    const response = await axios.post(
      `${apiEndpoint}/add-transaction`,
      {data: params},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );

    // Extract data and status directly from the response
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('AddTransaction error', err.response.data);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const WalletRewardPackages = async country => {
  try {
    const query = qs.stringify(
      {
        filters: {
          Country: country,
          Type: 'WalletPackage',
        },
        sort: ['weight:ASC'],
        populate: ['TriggerCondition', 'Reward'],
      },
      {
        encodeValuesOnly: true, // prettify URL
      },
    );

    const response = await axios.get(`${apiEndpoint}/reward-packages?${query}`);

    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('Fetch Me error', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const SendReceipt = async (walletID, transactionID, timeZone, jwt) => {
  const params = {
    walletID,
    transactionID,
    timeZone,
  };
  try {
    const response = await axios.post(
      `${apiEndpoint}/send-receipt`,
      {data: params},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );

    // Extract data and status directly from the response
    const data = await response;
    return {data: data.data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('CreateWallet error', err.response.data);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const GetStaff = async (Country, jwt) => {
  try {
    const query = qs.stringify(
      {
        filters: {
          currentCountry: Country,
          role: {
            type: {
              $in: ['organizer', 'referee'],
            },
          },
        },
        sort: ['FirstName:ASC'],
        populate: ['Image', 'role'],
      },
      {
        encodeValuesOnly: true, // prettify URL
      },
    );
    const response = await axios.get(`${apiEndpoint}/users?${query}`);
    const data = await response;
    return {data: data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('err.response', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};

export const GetFields = async (Country, lang) => {
  try {
    const query = qs.stringify(
      {
        filters: {
          Country,
        },
        populate: ['Image', 'Facilities', 'Album'],
        sort: lang === 'en' ? ['Name:asc'] : ['NameAR:asc'],
      },
      {
        encodeValuesOnly: true, // prettify URL
      },
    );
    const response = await axios.get(`${apiEndpoint}/locations?${query}`);
    const data = await response;
    return {data: data, status: data.status};
  } catch (err) {
    // Error 😨
    if (err.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log('err.response', err.response.data.error.details);

      return {data: err.response.data, status: err.response.status};
    }
  }
};
