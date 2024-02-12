import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

import {styles} from '@styles';
import {COLORS} from '@theme/colors';
import {SafeAreaView, StatusBar, View} from 'react-native';

import {useDispatch} from 'react-redux';
import {getData, FetchMe} from '@config/functions';
import {setAuthUserData, setJWT} from '@stores/slices/authUser';

import {setCountry, setCurrency, setTimezone} from '@stores/slices/country';

import {
  fetchTodayAndTomorrowMatches,
  fetchAnnouncements,
} from '@stores/services';
import {requestUserPermission} from '../../../firebase';
import CustomImage from '@components/custom/custom_image';
import {setLanguage} from '@stores/slices/language';
function SplashScreen(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const getFavouriteCountry = async () => {
    const countryCodeFromAsync = await getData('countryCode');

    if (countryCodeFromAsync) {
      Promise.all([
        dispatch(setCountry(countryCodeFromAsync)),
        dispatch(setCurrency(countryCodeFromAsync === 'JO' ? 'JOD' : 'QR')),
        dispatch(setTimezone(countryCodeFromAsync === 'JO' ? 3 : 3)),
      ]);

      return countryCodeFromAsync;
    } else {
      return false;
    }
  };

  const getCurrentLanguage = async () => {
    const languageFromAsync = await getData('currentLang');
    if (languageFromAsync) {
      dispatch(setLanguage(languageFromAsync));
      return languageFromAsync;
    } else {
      return 'en';
    }
  };

  const isUserAuthenticated = async () => {
    const authUserJWT = await getData('authUserJWT');
    if (authUserJWT) {
      const Me = await FetchMe(authUserJWT);
      if (Me !== undefined) {
        if (Me?.data && Me?.status === 200) {
          Promise.all([
            dispatch(setAuthUserData(Me?.data)),
            dispatch(setJWT(authUserJWT)),
          ]);
          return {data: Me?.data, jwt: authUserJWT};
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  useEffect(() => {
    getFavouriteCountry().then(countrySelected => {
      getCurrentLanguage().then(this_lang => {
        Promise.all([
          dispatch(fetchAnnouncements(countrySelected, this_lang, true)),
        ]);
        isUserAuthenticated().then(data => {
          setTimeout(() => {
            if (data === false) {
              navigation.replace('LandingStack', {
                screen: countrySelected
                  ? 'LandingScreen'
                  : 'SelectCountryScreen',
              });

              return;
            }
            requestUserPermission(
              data?.data?.id,
              data?.jwt,
              countrySelected,
              this_lang,
            );

            navigation.replace('TabsStack', {
              screen: 'HomeScreen',
            });
          }, 1000);
        });
      });
    });
  }, []);

  return (
    <SafeAreaView
      style={[
        styles.flex,
        styles.darkBackground,
        styles.alignCenter,
        styles.justifyCenter,
      ]}>
      <StatusBar
        animated={false}
        backgroundColor={COLORS.black}
        barStyle="light-content"
      />
      <View style={styles.container}>
        <CustomImage
          style={styles.mediumLogo}
          source={require('@assets/images/logo-white-full.png')}
        />
      </View>
    </SafeAreaView>
  );
}

export default SplashScreen;
