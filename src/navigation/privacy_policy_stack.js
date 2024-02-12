import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PrivacyPolicyScreen from '@screens/PrivacyPolicyScreen';

const Stack = createNativeStackNavigator();
function PrivacyPolicyStack({route: {params}}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
      />
    </Stack.Navigator>
  );
}

export default PrivacyPolicyStack;
