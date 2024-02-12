import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import GameRulesScreen from '@screens/GameRulesScreen';

const Stack = createNativeStackNavigator();
function TermsConditionsStack({route: {params}}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="GameRulesScreen" component={GameRulesScreen} />
    </Stack.Navigator>
  );
}

export default TermsConditionsStack;
