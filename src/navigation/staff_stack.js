import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StaffScreen from '@screens/StaffScreen';

const Stack = createNativeStackNavigator();
function StaffStack({route: {params}}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="StaffScreen" component={StaffScreen} />
    </Stack.Navigator>
  );
}

export default StaffStack;
