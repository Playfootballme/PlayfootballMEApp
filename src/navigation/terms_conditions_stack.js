import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TermsConditionsScreen from '@screens/TermsConditionsScreen';

const Stack = createNativeStackNavigator();
function TermsConditionsStack({route: {params}}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="TermsConditionsScreen"
        component={TermsConditionsScreen}
      />
    </Stack.Navigator>
  );
}

export default TermsConditionsStack;
