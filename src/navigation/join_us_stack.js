import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import JoinUsSelectRole from '@screens/JoinUsSelectRole';
import JoinUsSelectCountry from '@screens/JoinUsSelectCountry';
import JoinUsSelectCity from '@screens/JoinUsSelectCity';
import JoinUsSelectGender from '@screens/JoinUsSelectGender';
import JoinUsName from '@screens/JoinUsName';
import JoinUsAge from '@screens/JoinUsAge';
import JoinUsCurrentJob from '@screens/JoinUsCurrentJob';
import JoinUsContact from '@screens/JoinUsContact';
import JoinUsPreview from '@screens/JoinUsPreview';
import JoinUsSuccess from '@screens/JoinUsSuccess';

const Stack = createNativeStackNavigator();
function JoinUsStack({route: {params}}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="JoinUsSelectRole" component={JoinUsSelectRole} />
      <Stack.Screen
        name="JoinUsSelectCountry"
        component={JoinUsSelectCountry}
      />
      <Stack.Screen name="JoinUsSelectCity" component={JoinUsSelectCity} />
      <Stack.Screen name="JoinUsSelectGender" component={JoinUsSelectGender} />
      <Stack.Screen name="JoinUsName" component={JoinUsName} />
      <Stack.Screen name="JoinUsAge" component={JoinUsAge} />
      <Stack.Screen name="JoinUsCurrentJob" component={JoinUsCurrentJob} />
      <Stack.Screen name="JoinUsContact" component={JoinUsContact} />
      <Stack.Screen name="JoinUsPreview" component={JoinUsPreview} />
      <Stack.Screen name="JoinUsSuccess" component={JoinUsSuccess} />
    </Stack.Navigator>
  );
}

export default JoinUsStack;
