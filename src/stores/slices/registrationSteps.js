import {createSlice} from '@reduxjs/toolkit';

export const registrationStepsSlice = createSlice({
  name: 'registrationSteps',
  initialState: {
    id: '',
    jwt: '',
    email: '',
    verificationCode: '',
    password: '',
    username: '',
    FirstName: '',
    LastName: '',
    Phone: '',
    EmergencyPhone: '',
    Age: '',
    DOB: '',
    PrefPos: 'GK',
    Gender: 'Male',
  },
  reducers: {
    updateID: (state, action) => {
      state.id = action.payload;
      return state;
    },
    updateJWT: (state, action) => {
      state.jwt = action.payload;
      return state;
    },
    updateEmail: (state, action) => {
      state.email = action.payload;
      return state;
    },
    updateVerificationCode: (state, action) => {
      state.verificationCode = action.payload;
      return state;
    },
    updatePassword: (state, action) => {
      state.password = action.payload;
      return state;
    },
    updateUsername: (state, action) => {
      state.username = action.payload;
      return state;
    },
    updateFirstName: (state, action) => {
      state.FirstName = action.payload;
      return state;
    },
    updateLastName: (state, action) => {
      state.LastName = action.payload;
      return state;
    },
    updatePhone: (state, action) => {
      state.Phone = action.payload;
      return state;
    },
    updateEmergencyPhone: (state, action) => {
      state.EmergencyPhone = action.payload;
      return state;
    },
    updateAge: (state, action) => {
      state.Age = action.payload;
      return state;
    },
    updateDOB: (state, action) => {
      state.DOB = action.payload;
      return state;
    },
    updatePrefPos: (state, action) => {
      state.PrefPos = action.payload;
      return state;
    },
    updateGender: (state, action) => {
      state.Gender = action.payload;
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateID,
  updateJWT,
  updateEmail,
  updateVerificationCode,
  updatePassword,
  updateUsername,
  updateFirstName,
  updateLastName,
  updatePhone,
  updateEmergencyPhone,
  updateAge,
  updateDOB,
  updatePrefPos,
  updateGender,
} = registrationStepsSlice.actions;

export default registrationStepsSlice.reducer;
