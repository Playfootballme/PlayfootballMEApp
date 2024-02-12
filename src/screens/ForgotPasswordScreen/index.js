import React from 'react';
import {useNavigation} from '@react-navigation/native';

import HeroContainer from '@containers/hero_container';

import {styles} from '@styles';
import {Alert, View} from 'react-native';
import CustomText from '@components/custom/custom_text';
import {METRICS} from '@theme/metrics';
import Button from '@components/atoms/button';
import {EmailAvailability, ResetPassword, emailRegex} from '@config/functions';

import Input from '@components/atoms/input';
import {useStateIfMounted} from 'use-state-if-mounted';
import {t} from 'i18next';

function ForgotPasswordScreen(props) {
  const navigation = useNavigation();
  const [loading, setLoading] = useStateIfMounted(false);
  const [emailValue, setEmailValue] = useStateIfMounted('');
  const [passwordValue, setPasswordValue] = useStateIfMounted('');
  const onPressBack = () => {
    navigation.goBack();
  };

  const onChangeEmailHandler = text => {
    setEmailValue(text);
  };

  const resetPasswordHandler = async () => {
    setLoading(true);
    if (emailValue.length === 0) {
      Alert.alert(
        t('signIn:resetPasswordMainTitle'),
        t('common:enterYourEmail'),
        [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
      );
      return;
    }

    if (!emailRegex.test(emailValue)) {
      Alert.alert(
        t('signIn:resetPasswordMainTitle'),
        t('common:enterValidEmail'),
        [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
      );

      return;
    }
    const emailAvailability = await EmailAvailability(emailValue);
    if (emailAvailability.data.length === 0) {
      Alert.alert(
        t('signIn:resetPasswordMainTitle'),
        t('signIn:noUserWithThisEmail'),
        [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
      );
      return;
    } else {
      if (emailAvailability.data[0].confirmed === false) {
        Alert.alert(
          t('signIn:resetPasswordMainTitle'),
          t('signIn:noUserWithThisEmail'),
          [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
        );
        return;
      }
      const reset_password_resp = await ResetPassword(
        emailAvailability.data[0].id,
        emailValue,
      );

      if (reset_password_resp?.status === 200) {
        setLoading(false);

        navigation.navigate('PasswordVerifyCodeScreen', {
          userID: emailAvailability.data[0].id,
          email: emailValue,
          VCode: reset_password_resp.data.VerificationCode,
        });
      }
    }
  };

  const bottomButton = (
    <View
      style={[styles.container, {position: 'absolute', bottom: 20, zIndex: 1}]}>
      <View style={[styles.rowContainer, {marginBottom: METRICS.spaceNormal}]}>
        <CustomText style={[styles.fontSize.normal]}>
          {t('signUp:emailOTPNote')}
        </CustomText>
      </View>
      <View style={[styles.buttonRow]}>
        <Button
          loading={loading}
          disabled={loading}
          content={t('signIn:sendCodeButton')}
          variant="solid"
          size="normal"
          fullWidth={true}
          onPress={resetPasswordHandler}
        />
      </View>
    </View>
  );

  return (
    <HeroContainer
      title={t('signIn:resetPasswordMainTitle')}
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
            {t('signIn:forgotPasswordButton')}
          </CustomText>

          <CustomText style={[styles.fontSize.normal, styles.fontWeight.fw300]}>
            {t('signIn:enterYourEmailAddress')}
          </CustomText>
        </View>

        <View style={{marginTop: METRICS.spaceXLarge}}>
          <View style={[{marginBottom: METRICS.spaceCompact}]}>
            <Input
              placeholder={t('common:emailPlaceholder')}
              inputMode="email"
              text={emailValue}
              variant="email"
              onChange={onChangeEmailHandler}
            />
          </View>
        </View>
      </View>
    </HeroContainer>
  );
}

export default ForgotPasswordScreen;
