import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MatchesScreen from '@screens/MatchesScreen';

const Stack = createNativeStackNavigator();
function MatchesStack({route: {params}}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="MatchesScreen" component={MatchesScreen} />
    </Stack.Navigator>
  );
}

export default MatchesStack;
