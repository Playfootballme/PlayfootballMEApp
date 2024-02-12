import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProfileScreen from '@screens/ProfileScreen';
import BookingsScreen from '@screens/BookingsScreen';
import WalletScreen from '@screens/WalletScreen';
import TransferCreditScreen from '@screens/TransferCreditScreen';
import WalletTermsConditionsScreen from '@screens/WalletTermsConditionsScreen';
const Stack = createNativeStackNavigator();
function ProfileStack({route: {params}}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="BookingsScreen" component={BookingsScreen} />
      <Stack.Screen name="WalletScreen" component={WalletScreen} />
      <Stack.Screen
        name="TransferCreditScreen"
        component={TransferCreditScreen}
      />
      <Stack.Screen
        name="WalletTermsConditionsScreen"
        component={WalletTermsConditionsScreen}
      />
    </Stack.Navigator>
  );
}

export default ProfileStack;
