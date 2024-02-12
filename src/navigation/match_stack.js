import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MatchScreen from '@screens/MatchScreen';
import ExpensesScreen from '@screens/ExpensesScreen';

const Stack = createNativeStackNavigator();
function MatchStack({route: {params}}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="MatchScreen" component={MatchScreen} />
      <Stack.Screen name="ExpensesScreen" component={ExpensesScreen} />
    </Stack.Navigator>
  );
}

export default MatchStack;
