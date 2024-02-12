import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

import HeroContainer from '@containers/hero_container';

import {styles} from '@styles';
import {View, TouchableOpacity, Alert, ActivityIndicator} from 'react-native';
import CustomText from '@components/custom/custom_text';
import {METRICS} from '@theme/metrics';
import Button from '@components/atoms/button';
import VerificationCode from '@components/atoms/verification_code';
import {useSelector} from 'react-redux';
import {ResetPassword} from '@config/functions';
import {useStateIfMounted} from 'use-state-if-mounted';

import {COLORS} from '@theme/colors';
import {t} from 'i18next';

function SignUpVerifyCodeScreen(props) {
  const navigation = useNavigation();

  const initEmail = useSelector(state => state.registrationSteps.email);
  const initCode = useSelector(
    state => state.registrationSteps.verificationCode,
  );

  const [codeToCheck, setCodeToCheck] = useStateIfMounted(initCode);
  const userID = useSelector(state => state.registrationSteps.id);

  const [error, setError] = useStateIfMounted({
    value: false,
    message: '',
  });
  const [code, setCode] = useStateIfMounted('');

  const ConfirmVerificationCode = async () => {
    if (Number(code) === Number(codeToCheck)) {
      // updateUser
      navigation.navigate('SignUpNewPasswordScreen');
    } else {
      Alert.alert(t('signUp:signUpButton'), t('signUp:alertOTPIncorrect'), [
        {
          text: t('common:tryAgain'),
          onPress: () => console.log('OK Pressed'),
        },
      ]);
    }
  };
  const [counter, setCounter] = useStateIfMounted(60);
  const [buttonDisabled, setButtonDisabled] = useStateIfMounted(true);
  const [loading, setLoading] = useStateIfMounted(false);
  useEffect(() => {
    let interval;

    if (counter > 0) {
      interval = setInterval(() => {
        setCounter(prevCounter => prevCounter - 1);
      }, 1000);
    } else {
      setButtonDisabled(false);
    }

    return () => {
      clearInterval(interval);
    };
  }, [counter]);

  const SendAgainHandler = async () => {
    setLoading(true);
    const reset_password_resp = await ResetPassword(userID, initEmail);

    if (reset_password_resp?.status === 200) {
      setLoading(false);
      setCounter(60);
      setButtonDisabled(true);
      setCodeToCheck(reset_password_resp.data.VerificationCode);
    }
  };

  const onCodeChange = value => {
    setError({
      value: false,
      message: '',
    });
    setCode(value);
  };

  const onPressBack = () => {
    navigation.goBack();
  };

  const bottomButton = (
    <View
      style={[styles.container, {position: 'absolute', bottom: 20, zIndex: 1}]}>
      <View style={[styles.rowContainer, {marginBottom: METRICS.spaceNormal}]}>
        <CustomText style={[styles.fontSize.normal]}>
          {t('signUp:noCodeNote')}
        </CustomText>
        <TouchableOpacity
          onPress={SendAgainHandler}
          disabled={buttonDisabled || loading}
          style={{marginLeft: METRICS.spaceTiny}}>
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : counter > 0 ? (
            <CustomText
              style={[styles.fontSize.normal, styles.fontWeight.fw600]}>
              {`${t('signUp:sendAgainCounterPt1')} ${counter}${t(
                'signUp:sendAgainCounterPt2',
              )}`}
            </CustomText>
          ) : (
            <CustomText
              style={[styles.fontSize.normal, styles.fontWeight.fw600]}>
              {t('signUp:sendNowButton')}
            </CustomText>
          )}
        </TouchableOpacity>
      </View>
      <View style={[styles.buttonRow]}>
        <Button
          content={t('common:continue')}
          variant="solid"
          size="normal"
          fullWidth={true}
          onPress={ConfirmVerificationCode}
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
            {t('signUp:enterCodeTitle')}
          </CustomText>

          <CustomText style={[styles.fontSize.normal, styles.fontWeight.fw300]}>
            {`${t('signUp:enterCodeDesc')} ${initEmail}`}
          </CustomText>
        </View>

        <View style={{marginTop: METRICS.spaceXXLarge}}>
          <VerificationCode isInvalid={error.value} onChange={onCodeChange} />
        </View>
      </View>
    </HeroContainer>
  );
}

export default SignUpVerifyCodeScreen;
