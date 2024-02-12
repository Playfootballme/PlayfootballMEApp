import React from 'react';
import {useNavigation} from '@react-navigation/native';

import HeroContainer from '@containers/hero_container';

import {styles} from '@styles';
import {View, Alert} from 'react-native';
import CustomText from '@components/custom/custom_text';
import {METRICS} from '@theme/metrics';
import Button from '@components/atoms/button';
import Input from '@components/atoms/input';
import Checkbox from '@components/atoms/checkbox';
import {
  EmailValidity,
  EmailAvailability,
  InitUser,
  ReInitUser,
  emailRegex,
} from '@config/functions';
import {
  updateID,
  updateEmail,
  updateVerificationCode,
} from '@stores/slices/registrationSteps';
import {useDispatch} from 'react-redux';
import {useStateIfMounted} from 'use-state-if-mounted';
import {t} from 'i18next';

function SignUpScreen(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [emailValue, setEmailValue] = useStateIfMounted('');
  const [acceptTerms, setAcceptTerms] = useStateIfMounted(false);
  const [loading, setLoading] = useStateIfMounted(false);
  const onPressBack = () => {
    navigation.goBack();
  };

  const onChangeEmailHandler = text => {
    setEmailValue(text);
  };

  const RegisterEmailHandler = async () => {
    setLoading(true);
    if (!acceptTerms) {
      Alert.alert(t('signUp:signUpButton'), t('common:alertAcceptTC'), [
        {text: t('common:tryAgain'), onPress: () => setLoading(false)},
      ]);
      return;
    }
    if (emailValue.length === 0) {
      Alert.alert(t('signUp:signUpButton'), t('common:enterYourEmail'), [
        {text: t('common:tryAgain'), onPress: () => setLoading(false)},
      ]);
      return;
    }

    if (!emailRegex.test(emailValue)) {
      Alert.alert(t('signUp:signUpButton'), t('common:enterValidEmail'), [
        {text: t('common:tryAgain'), onPress: () => setLoading(false)},
      ]);
      return;
    }
    if (EmailValidity(emailValue)) {
      const emailAvailability = await EmailAvailability(emailValue);
      if (emailAvailability.data.length === 0) {
        const initUser = await InitUser(emailValue);

        if (initUser.status === 200) {
          setLoading(false);
          dispatch(updateEmail(emailValue));
          dispatch(updateID(initUser.data.id));
          dispatch(updateVerificationCode(initUser.data.VerificationCode));
          navigation.navigate('SignUpVerifyCodeScreen');
        }
      } else {
        if (emailAvailability.data[0].confirmed === false) {
          const initUser = await ReInitUser(
            emailValue,
            emailAvailability.data[0].id,
          );

          if (initUser.status === 200) {
            setLoading(false);

            dispatch(updateEmail(emailValue));
            dispatch(updateID(initUser.data.id));
            dispatch(updateVerificationCode(initUser.data.VerificationCode));
            navigation.navigate('SignUpVerifyCodeScreen');
          }
          return;
        }
        Alert.alert(
          t('signUp:signUpButton'),
          `${t('signUp:alertAlreadyInUsePt1')} ${emailValue} ${t(
            'signUp:alertAlreadyInUsePt2',
          )}`,
          [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
        );
      }
    } else {
      Alert.alert(
        t('signUp:signUpButton'),
        `${t('signUp:alertAlreadyInUsePt1')} ${emailValue} ${t(
          'signUp:alertNotValid',
        )}`,
        [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
      );
    }
  };

  const bottomButton = (
    <View
      style={[styles.container, {position: 'absolute', bottom: 20, zIndex: 1}]}>
      <Checkbox
        label={t('common:acceptTCLabel')}
        value={acceptTerms}
        onChange={() => setAcceptTerms(!acceptTerms)}
      />

      <View style={[styles.buttonRow]}>
        <Button
          content={t('common:continue')}
          variant="solid"
          size="normal"
          fullWidth={true}
          loading={loading}
          disabled={loading}
          onPress={RegisterEmailHandler}
        />
      </View>
    </View>
  );

  return (
    <HeroContainer
      title={t('signUp:signUpButton')}
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
            {t('signUp:emailAddress')}
          </CustomText>

          <CustomText style={[styles.fontSize.normal, styles.fontWeight.fw300]}>
            {t('signUp:emailDesc')}
          </CustomText>
        </View>

        <View style={{marginTop: METRICS.spaceXLarge}}>
          <View style={[{marginBottom: METRICS.spaceSmall}]}>
            <Input
              placeholder={t('common:emailPlaceholder')}
              inputMode="email"
              text={emailValue}
              onChange={onChangeEmailHandler}
            />
          </View>
          <View
            style={[styles.rowContainer, {marginBottom: METRICS.spaceNormal}]}>
            <CustomText style={[styles.fontSize.small]}>
              {t('signUp:emailOTPNote')}
            </CustomText>
          </View>
        </View>
      </View>
    </HeroContainer>
  );
}

export default SignUpScreen;
