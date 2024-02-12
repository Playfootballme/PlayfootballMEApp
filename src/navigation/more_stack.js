import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MoreScreen from '@screens/MoreScreen';

const Stack = createNativeStackNavigator();
function MoreStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="MoreScreen" component={MoreScreen} />
    </Stack.Navigator>
  );
}

export default MoreStack;
