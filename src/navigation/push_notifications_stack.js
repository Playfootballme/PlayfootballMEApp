import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PushNotificationsScreen from '@screens/PushNotificationsScreen';

const Stack = createNativeStackNavigator();
function PushNotificationsStack({route: {params}}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="PushNotificationsScreen"
        component={PushNotificationsScreen}
      />
    </Stack.Navigator>
  );
}

export default PushNotificationsStack;
