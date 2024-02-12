import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PlayerScreen from '@screens/PlayerScreen';
import PlayersScreen from '@screens/PlayersScreen';

const Stack = createNativeStackNavigator();
function PlayersStack({route: {params}}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="PlayersScreen" component={PlayersScreen} />
      <Stack.Screen name="PlayerScreen" component={PlayerScreen} />
    </Stack.Navigator>
  );
}

export default PlayersStack;
