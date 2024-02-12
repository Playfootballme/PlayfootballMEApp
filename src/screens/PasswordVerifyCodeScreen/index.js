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
import {COLORS} from '../../theme/colors';
import {ResetPassword} from '@config/functions';
import {useStateIfMounted} from 'use-state-if-mounted';
import {t} from 'i18next';

function PasswordVerifyCodeScreen(props) {
  const navigation = useNavigation();
  const initEmail = useSelector(state => state.registrationSteps.email);

  const {VCode, userID, email} = props.route.params;

  const [codeToCheck, setCodeToCheck] = useStateIfMounted(VCode);

  const [error, setError] = useStateIfMounted({
    value: false,
    message: '',
  });
  const [code, setCode] = useStateIfMounted('');

  const ConfirmVerificationCode = () => {
    if (Number(code) === Number(codeToCheck)) {
      navigation.navigate('NewPasswordScreen', {
        userID,
        email,
      });
    } else {
      Alert.alert(
        t('signIn:resetPasswordMainTitle'),
        t('signUp:alertOTPIncorrect'),
        [
          {
            text: t('common:tryAgain'),
            onPress: () => console.log('OK Pressed'),
          },
        ],
      );
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
    const reset_password_resp = await ResetPassword(userID, email);

    if (reset_password_resp?.status === 200) {
      setLoading(false);
      setCounter(60);
      setButtonDisabled(true);
      setCodeToCheck(reset_password_resp.data.VerificationCode);
    }
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
            {t('signUp:enterCodeTitle')}
          </CustomText>

          <CustomText style={[styles.fontSize.normal, styles.fontWeight.fw300]}>
            {`${t('signUp:enterCodeDesc')} ${email}`}
          </CustomText>
        </View>

        <View style={{marginTop: METRICS.spaceXXLarge}}>
          <VerificationCode isInvalid={error.value} onChange={onCodeChange} />
        </View>
      </View>
    </HeroContainer>
  );
}

export default PasswordVerifyCodeScreen;
