import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FieldScreen from '@screens/FieldScreen';

const Stack = createNativeStackNavigator();
function FieldStack({route: {params}}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="FieldScreen" component={FieldScreen} />
    </Stack.Navigator>
  );
}

export default FieldStack;
