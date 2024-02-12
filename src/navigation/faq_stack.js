import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FAQScreen from '@screens/FAQScreen';

const Stack = createNativeStackNavigator();
function FAQStack({route: {params}}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="FAQScreen" component={FAQScreen} />
    </Stack.Navigator>
  );
}

export default FAQStack;
