import React, {createRef, useEffect} from 'react';

import {NavigationContainer} from '@react-navigation/native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
//components
import Icon from '@components/atoms/icon';
import {COLORS} from '@theme/colors';

import CustomText from '@components/custom/custom_text';

//stacks
import LandingStack from '@navigation/landing_stack';
import HomeStack from '@navigation/home_stack';
import MatchesStack from '@navigation/matches_stack';
import MatchStack from '@navigation/match_stack';
import PickupStack from '@navigation/pickup_stack';
import ProfileStack from '@navigation/profile_stack';
import MoreStack from '@navigation/more_stack';
import PushNotificationsStack from '@navigation/push_notifications_stack';
import FAQStack from '@navigation/faq_stack';
import PrivacyPolicyStack from '@navigation/privacy_policy_stack';
import TermsConditionsStack from '@navigation/terms_conditions_stack';
import GameRulesStack from '@navigation/game_rules_stack';
import SuccessStack from '@navigation/success_stack';
import AnnouncementStack from '@navigation/announcement_stack';
import SplashStack from '@navigation/splash_stack';
import PlayersStack from '@navigation/players_stack';
import PastMatchesStack from '@navigation/past_matches_stack';
import TournamentsStack from '@navigation/tournaments_stack';
import PastTournamentsStack from '@navigation/past_tournaments_stack';
import TournamentStack from '@navigation/tournament_stack';
import JoinUsStack from '@navigation/join_us_stack';
import StaffStack from '@navigation/staff_stack';
import FieldsStack from '@navigation/fields_stack';
import FieldStack from '@navigation/field_stack';

import {enableScreens} from 'react-native-screens';
import {t} from 'i18next';
import {useTranslation} from 'react-i18next';
import {getData} from './src/config/functions';

import {Linking} from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
// if (__DEV__) {
//   import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
// }

const TabsStack = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          var iconName;

          switch (route.name) {
            case t('common:home'):
              iconName = 'home';
              break;

            case t('common:matches'):
              iconName = 'football';
              break;

            case t('common:fields'):
              iconName = 'football-field';
              break;

            case t('common:more'):
              iconName = 'more';
              break;
          }
          return (
            <Icon
              name={iconName}
              size={25}
              color={focused ? COLORS.blue : COLORS.white}
            />
          );
        },
        tabBarActiveTintColor: COLORS.blue,
        //Tab bar styles can be added here
        tabBarStyle: {
          backgroundColor: COLORS.black,
        },
      })}>
      <Tab.Screen name={t('common:home')} component={HomeStack} />
      <Tab.Screen name={t('common:fields')} component={FieldsStack} />
      <Tab.Screen name={t('common:more')} component={MoreStack} />
    </Tab.Navigator>
  );
};

const getCurrentLanguage = async () => {
  const languageFromAsync = await getData('currentLang');

  if (languageFromAsync) {
    return languageFromAsync;
  } else {
    return 'en';
  }
};
export default function App(props) {
  enableScreens(false);
  const {i18n} = useTranslation();
  useEffect(() => {
    getCurrentLanguage().then(this_lang => {
      // if (this_lang === 'ar') {
      //   I18nManager.allowRTL(true);
      //   I18nManager.forceRTL(true);
      //   I18nManager.swapLeftAndRightInRTL(true);
      // }
      i18n.changeLanguage(this_lang);
      // moment.updateLocale(this_lang, this_lang === 'en' ? enConfig : arConfig);
    });
  }, []);

  const navigationRef = createRef();

  Linking.addEventListener('url', event => {
    const {path, queryParams} = Linking.parse(event.url);
    if (path === 'match/:matchID') {
      // Extract the matchID from queryParams or path
      const matchID = queryParams.matchID || path.split('/')[1];

      // Use your navigation library to navigate to the MatchScreen with the extracted matchID
      // This is an example with React Navigation
      navigationRef.current?.navigate('MatchScreen', {matchID});
    }
  });

  return (
    <>
      <NavigationContainer
        linking={{
          prefixes: ['play://'], // Replace with your deep link scheme
          config: {
            screens: {
              MatchScreen: 'match/:matchID', // Define the deep link pattern
            },
          },
        }}
        ref={navigationRef}
        fallback={<CustomText>Loading...</CustomText>}>
        <Stack.Navigator initialRouteName={'SplashStack'}>
          <Stack.Screen
            name="SplashStack"
            options={{headerShown: false}}
            component={SplashStack}
          />
          <Stack.Screen
            name="LandingStack"
            options={{headerShown: false}}
            component={LandingStack}
          />
          <Stack.Screen
            name="TabsStack"
            options={{headerShown: false}}
            component={TabsStack}
          />
          <Stack.Screen
            name="AnnouncementStack"
            options={{headerShown: false}}
            component={AnnouncementStack}
          />
          <Stack.Screen
            name="SuccessStack"
            options={{headerShown: false}}
            component={SuccessStack}
          />
          <Stack.Screen
            name="MatchStack"
            options={{headerShown: false}}
            component={MatchStack}
          />
          <Stack.Screen
            name="PastMatchesStack"
            options={{headerShown: false}}
            component={PastMatchesStack}
          />

          <Stack.Screen
            name="TournamentStack"
            options={{headerShown: false}}
            component={TournamentStack}
          />
          <Stack.Screen
            name="PastTournamentsStack"
            options={{headerShown: false}}
            component={PastTournamentsStack}
          />
          <Stack.Screen
            name="PickupStack"
            options={{headerShown: false}}
            component={PickupStack}
          />
          <Stack.Screen
            name="ProfileStack"
            options={{headerShown: false}}
            component={ProfileStack}
          />
          <Stack.Screen
            name="PushNotificationsStack"
            options={{headerShown: false}}
            component={PushNotificationsStack}
          />
          <Stack.Screen
            name="FAQStack"
            options={{headerShown: false}}
            component={FAQStack}
          />
          <Stack.Screen
            name="PrivacyPolicyStack"
            options={{headerShown: false}}
            component={PrivacyPolicyStack}
          />
          <Stack.Screen
            name="TermsConditionsStack"
            options={{headerShown: false}}
            component={TermsConditionsStack}
          />
          <Stack.Screen
            name="GameRulesStack"
            options={{headerShown: false}}
            component={GameRulesStack}
          />
          <Stack.Screen
            name="PlayersStack"
            options={{headerShown: false}}
            component={PlayersStack}
          />
          <Stack.Screen
            name="JoinUsStack"
            options={{headerShown: false}}
            component={JoinUsStack}
          />

          <Stack.Screen
            name="StaffStack"
            options={{headerShown: false}}
            component={StaffStack}
          />

          <Stack.Screen
            name="FieldStack"
            options={{headerShown: false}}
            component={FieldStack}
          />
        </Stack.Navigator>
      </NavigationContainer>
      {/* <Toast config={toastConfig} /> */}
    </>
  );
}
