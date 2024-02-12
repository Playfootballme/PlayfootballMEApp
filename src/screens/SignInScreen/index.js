import React from 'react';
import {useNavigation} from '@react-navigation/native';

import HeroContainer from '@containers/hero_container';

import {styles} from '@styles';
import {View, TouchableOpacity, Alert} from 'react-native';
import CustomText from '@components/custom/custom_text';
import {METRICS} from '@theme/metrics';
import Button from '@components/atoms/button';

import Input from '@components/atoms/input';
import {useDispatch} from 'react-redux';
import {
  storeData,
  LoginUser,
  EmailAvailability,
  emailRegex,
} from '@config/functions';
import {fetchMe} from '@stores/services';
import {setJWT} from '@stores/slices/authUser';
import {useStateIfMounted} from 'use-state-if-mounted';
import {t} from 'i18next';

function SignInScreen(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [emailValue, setEmailValue] = useStateIfMounted('');
  const [passwordValue, setPasswordValue] = useStateIfMounted('');
  const onPressBack = () => {
    navigation.goBack();
  };

  const onChangeEmailHandler = text => {
    setEmailValue(text);
  };
  const onChangePasswordHandler = text => {
    setPasswordValue(text);
  };

  const signInHandler = async () => {
    if (emailValue.length === 0) {
      Alert.alert(t('signUp:signInButton'), t('common:enterYourEmail'), [
        {
          text: t('common:tryAgain'),
          onPress: () => console.log(t('common:tryAgain')),
        },
      ]);
      return;
    }

    if (!emailRegex.test(emailValue)) {
      Alert.alert(t('signUp:signInButton'), t('common:enterValidEmail'), [
        {text: t('common:tryAgain'), onPress: () => console.log('OK Pressed')},
      ]);
      return;
    }

    if (passwordValue.length === 0) {
      Alert.alert(t('signUp:signInButton'), t('signIn:alertPasswordEmpty'), [
        {
          text: t('common:tryAgain'),
          onPress: () => console.log(t('common:tryAgain')),
        },
      ]);
      return;
    }
    const response = await LoginUser(emailValue, passwordValue);

    if (response.status !== 200) {
      if (response.status === 400) {
        const email_here = await EmailAvailability(emailValue);
        if (email_here.data.length > 0) {
          Alert.alert(
            t('signUp:signInButton'),
            t('signIn:alertPasswordIncorrect'),
            [
              {
                text: t('common:tryAgain'),
                onPress: () => console.log(t('common:tryAgain')),
              },
            ],
          );
        } else {
          Alert.alert(
            t('signUp:signInButton'),
            t('signIn:noUserWithThisEmail'),
            [
              {
                text: t('common:tryAgain'),
                onPress: () => console.log(t('common:tryAgain')),
              },
            ],
          );
        }
      }
    } else {
      if (response.data.user.confirmed === false) {
        Alert.alert(t('signUp:signInButton'), t('signIn:noUserWithThisEmail'), [
          {
            text: t('common:tryAgain'),
            onPress: () => console.log(t('common:tryAgain')),
          },
        ]);
        return;
      }
      await storeData('authUserJWT', JSON.stringify(response.data.jwt));
      dispatch(setJWT(response.data.jwt));
      dispatch(fetchMe(response.data.jwt));
      navigation.replace('TabsStack', {
        screen: 'HomeScreen',
      });
    }
  };

  // LoginUser
  const bottomButton = (
    <View style={[styles.container]}>
      <View style={[styles.rowContainer, {marginBottom: METRICS.spaceNormal}]}>
        <CustomText style={[styles.fontSize.normal]}>
          {t('signIn:noAccountLabel')}
        </CustomText>
        <TouchableOpacity
          onPress={() => navigation.navigate('SignUpScreen')}
          style={{marginLeft: METRICS.spaceTiny}}>
          <CustomText style={[styles.fontSize.normal, styles.fontWeight.fw600]}>
            {t('signUp:registerButton')}
          </CustomText>
        </TouchableOpacity>
      </View>

      <View style={[styles.buttonRow]}>
        <Button
          content={t('signUp:signInButton')}
          variant="solid"
          size="normal"
          fullWidth={true}
          onPress={signInHandler}
        />
      </View>
    </View>
  );

  return (
    <HeroContainer
      title={t('signUp:signInButton')}
      onPressBack={onPressBack}
      bottomButton={bottomButton}>
      <View style={[styles.container]}>
        <View style={{marginTop: METRICS.spaceNormal}}>
          <CustomText
            style={[
              styles.fontSize.large,
              styles.fontWeight.fw600,
              {marginBottom: METRICS.spaceSmall},
            ]}>
            {t('signUp:signInButton')}
          </CustomText>

          <CustomText style={[styles.fontSize.large, styles.fontWeight.fw300]}>
            {t('signIn:welcomeBack')}
          </CustomText>
          <CustomText style={[styles.fontSize.large, styles.fontWeight.fw300]}>
            {t('signIn:playfootballME')}
          </CustomText>
        </View>

        <View style={{marginTop: METRICS.spaceXXLarge}}>
          <View style={[{marginBottom: METRICS.spaceCompact}]}>
            <Input
              placeholder={t('common:emailPlaceholder')}
              text={emailValue}
              inputMode="email"
              variant="email"
              onChange={onChangeEmailHandler}
            />
          </View>
          <View style={[{marginBottom: METRICS.spaceCompact}]}>
            <Input
              text={passwordValue}
              placeholder={t('signIn:passwordPlaceholder')}
              inputMode="text"
              variant="password"
              onChange={onChangePasswordHandler}
            />
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPasswordScreen')}>
            <CustomText style={[styles.fontSize.normal]}>
              {t('signIn:forgotPasswordButton')}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </HeroContainer>
  );
}

export default SignInScreen;
