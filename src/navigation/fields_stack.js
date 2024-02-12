import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FieldsScreen from '@screens/FieldsScreen';

const Stack = createNativeStackNavigator();
function FieldsStack({route: {params}}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="FieldsScreen" component={FieldsScreen} />
    </Stack.Navigator>
  );
}

export default FieldsStack;
