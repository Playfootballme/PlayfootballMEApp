import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LandingScreen from '@screens/LandingScreen';
import SelectCountryScreen from '@screens/SelectCountryScreen';
import SignInScreen from '@screens/SignInScreen';
import ForgotPasswordScreen from '@screens/ForgotPasswordScreen';
import PasswordVerifyCodeScreen from '@screens/PasswordVerifyCodeScreen';
import NewPasswordScreen from '@screens/NewPasswordScreen';
import SignUpScreen from '@screens/SignUpScreen';
import SignUpVerifyCodeScreen from '@screens/SignUpVerifyCodeScreen';
import SignUpNewPasswordScreen from '@screens/SignUpNewPasswordScreen';
import SignUpUsernameScreen from '@screens/SignUpUsernameScreen';
import SignUpNameScreen from '@screens/SignUpNameScreen';
import SignUpPhonesScreen from '@screens/SignUpPhonesScreen';
import SignUpAgeScreen from '@screens/SignUpAgeScreen';
import SignUpPrefPosScreen from '@screens/SignUpPrefPosScreen';
import SignUpGenderScreen from '@screens/SignUpGenderScreen';

const Stack = createNativeStackNavigator();
function LandingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="SelectCountryScreen"
        component={SelectCountryScreen}
      />
      <Stack.Screen name="LandingScreen" component={LandingScreen} />

      <Stack.Screen name="SignInScreen" component={SignInScreen} />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
      />
      <Stack.Screen
        name="PasswordVerifyCodeScreen"
        component={PasswordVerifyCodeScreen}
      />
      <Stack.Screen name="NewPasswordScreen" component={NewPasswordScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen
        name="SignUpVerifyCodeScreen"
        component={SignUpVerifyCodeScreen}
      />
      <Stack.Screen
        name="SignUpNewPasswordScreen"
        component={SignUpNewPasswordScreen}
      />
      <Stack.Screen
        name="SignUpUsernameScreen"
        component={SignUpUsernameScreen}
      />

      <Stack.Screen name="SignUpNameScreen" component={SignUpNameScreen} />
      <Stack.Screen name="SignUpPhonesScreen" component={SignUpPhonesScreen} />
      <Stack.Screen name="SignUpAgeScreen" component={SignUpAgeScreen} />
      <Stack.Screen
        name="SignUpPrefPosScreen"
        component={SignUpPrefPosScreen}
      />
      <Stack.Screen name="SignUpGenderScreen" component={SignUpGenderScreen} />
    </Stack.Navigator>
  );
}

export default LandingStack;
