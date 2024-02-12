import React from 'react';
import {useNavigation, CommonActions} from '@react-navigation/native';

import LandingContainer from '@containers/landing_container';
import {styles} from '@styles';

import {View, TouchableOpacity, Alert, I18nManager} from 'react-native';

import CustomText from '@components/custom/custom_text';
import Button from '@components/atoms/button';
import {METRICS} from '@theme/metrics';
import CustomImage from '@components/custom/custom_image';
import {t} from 'i18next';
import {storeData} from '@config/functions';
import {useSelector} from 'react-redux';
import {getLanguage} from '@stores/selectors';
import RNRestart from 'react-native-restart';
import {COLORS} from '@theme/colors';

function LandingScreen(props) {
  const navigation = useNavigation();
  const currentLang = useSelector(getLanguage);

  const changeLanguageHandler = () => {
    Alert.alert(t('common:restartRequired'), t('more:alertLanguageChange'), [
      {
        text: t('common:restartApprove'),
        style: 'cancel',
        onPress: async () => {
          await storeData(
            'currentLang',
            JSON.stringify(currentLang === 'en' ? 'ar' : 'en'),
          );

          I18nManager.allowRTL(currentLang === 'en');
          I18nManager.swapLeftAndRightInRTL(currentLang === 'en');
          I18nManager.forceRTL(currentLang === 'en');
          setTimeout(() => {
            RNRestart.restart();
          }, 500);
        },
      },
      {
        text: t('common:cancel'),
        onPress: () => {
          console.log('cancel');
        },
        style: 'cancel',
      },
    ]);
  };
  return (
    <LandingContainer scroll={true}>
      <View style={[styles.container]}>
        <CustomImage
          source={require('@assets/images/FootballFields.png')}
          style={{width: 345, height: 300}}
          resizeMode="contain"
        />
        <View style={{marginTop: METRICS.spaceNormal}}>
          <CustomText style={[styles.fontSize.large, styles.fontWeight.fw600]}>
            {t('signUp:discover')}
          </CustomText>

          <CustomText style={[styles.fontSize.large, styles.fontWeight.fw600]}>
            {t('signUp:footballCommunity')}
          </CustomText>
        </View>
        <View style={{marginTop: METRICS.spaceNormal}}>
          <CustomText
            style={[
              styles.fontSize.normal,
              styles.fontWeight.fw400,
              styles.fontColor.grey,
            ]}>
            {t('signUp:findPlayersAround')}
          </CustomText>
        </View>
        <View style={[styles.rowContainer, {marginTop: METRICS.spaceNormal}]}>
          <Button
            content={t('signUp:registerButton')}
            onPress={() => {
              navigation.navigate('SignUpScreen');
            }}
            variant="solid"
            size="normal"
            halfWidth
            style={{marginRight: METRICS.spaceTiny}}
          />
          <Button
            content={t('signUp:signInButton')}
            onPress={() => {
              navigation.navigate('SignInScreen');
            }}
            variant="solid"
            size="normal"
            halfWidth
          />
        </View>
        <View style={[{flex: 1, marginTop: METRICS.spaceNormal}]}>
          <Button
            content={t('signUp:continueGuest')}
            onPress={() => {
              navigation.navigate('TabsStack', {
                screen: 'HomeScreen',
              });
            }}
            variant="outline"
            size="normal"
            fullWidth
          />
        </View>

        <TouchableOpacity
          style={{
            marginVertical: METRICS.spaceLarge,
          }}
          onPress={changeLanguageHandler}>
          <CustomText
            style={[
              styles.fontWeight.fw700,
              styles[`fontFamily_${currentLang === 'ar' ? 'en' : 'ar'}`],
              {
                textAlign: 'center',
                color: COLORS.white,
              },
            ]}>
            {t('common:changeLanguage')}
          </CustomText>
        </TouchableOpacity>
      </View>
    </LandingContainer>
  );
}

export default LandingScreen;
