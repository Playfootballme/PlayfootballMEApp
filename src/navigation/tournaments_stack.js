import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TournamentsScreen from '@screens/TournamentsScreen';

const Stack = createNativeStackNavigator();
function TournamentsStack({route: {params}}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="TournamentsScreen" component={TournamentsScreen} />
    </Stack.Navigator>
  );
}

export default TournamentsStack;
