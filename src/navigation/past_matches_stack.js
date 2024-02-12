import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PastMatchesScreen from '@screens/PastMatchesScreen';

const Stack = createNativeStackNavigator();
function PastMatchesStack({route: {params}}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="PastMatchesScreen" component={PastMatchesScreen} />
    </Stack.Navigator>
  );
}

export default PastMatchesStack;
