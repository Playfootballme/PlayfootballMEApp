import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PickupScreen from '@screens/PickupScreen';

const Stack = createNativeStackNavigator();
function PickupStack({route: {params}}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="PickupScreen" component={PickupScreen} />
    </Stack.Navigator>
  );
}

export default PickupStack;
