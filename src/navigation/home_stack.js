import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '@screens/HomeScreen';
import AnnouncementScreen from '@screens/AnnouncementScreen';

const Stack = createNativeStackNavigator();
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="AnnouncementScreen" component={AnnouncementScreen} />
    </Stack.Navigator>
  );
}

export default HomeStack;
