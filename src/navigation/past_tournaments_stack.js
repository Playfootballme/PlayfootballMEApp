import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PastTournamentsScreen from '@screens/PastTournamentsScreen';

const Stack = createNativeStackNavigator();
function PastTournamentsStack({route: {params}}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="PastTournamentsScreen"
        component={PastTournamentsScreen}
      />
    </Stack.Navigator>
  );
}

export default PastTournamentsStack;
