import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PickupsScreen from '@screens/PickupsScreen';

const Stack = createNativeStackNavigator();
function PickupsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="PickupsScreen" component={PickupsScreen} />
    </Stack.Navigator>
  );
}

export default PickupsStack;
