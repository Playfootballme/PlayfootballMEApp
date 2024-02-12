import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AnnouncementScreen from '@screens/AnnouncementScreen';

const Stack = createNativeStackNavigator();
function AnnouncementStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="AnnouncementScreen" component={AnnouncementScreen} />
    </Stack.Navigator>
  );
}

export default AnnouncementStack;
