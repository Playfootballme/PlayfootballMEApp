import React from 'react';
import {useNavigation} from '@react-navigation/native';

import HeroContainer from '@containers/hero_container';

import {styles} from '@styles';
import {Alert, View} from 'react-native';
import CustomText from '@components/custom/custom_text';
import {METRICS} from '@theme/metrics';
import Button from '@components/atoms/button';
import Input from '@components/atoms/input';
import {updatePassword} from '@stores/slices/registrationSteps';

import {useDispatch} from 'react-redux';

import {passwordRegex} from '@config/functions';
import {useStateIfMounted} from 'use-state-if-mounted';
import {t} from 'i18next';

function SignUpNewPasswordScreen(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [confirmPasswordValue, setConfirmPassword] = useStateIfMounted('');
  const [passwordValue, setPasswordValue] = useStateIfMounted('');
  const onPressBack = () => {
    navigation.goBack();
  };

  const onChangePasswordHandler = text => {
    setPasswordValue(text);
  };

  const onChangeConfirmPasswordHandler = text => {
    setConfirmPassword(text);
  };

  const RegisterPasswordHandler = () => {
    if (passwordValue === confirmPasswordValue) {
      if (passwordValue.length < 6) {
        Alert.alert(t('signUp:signUpButton'), t('signUp:alertPasswordLimit'), [
          {
            text: t('common:tryAgain'),
            onPress: () => console.log('OK Pressed'),
          },
        ]);
        return;
      }
      if (!passwordRegex.test(passwordValue)) {
        Alert.alert(
          t('signUp:signUpButton'),
          t('signUp:alertPasswordSpecialChar'),
          [
            {
              text: t('common:tryAgain'),
              onPress: () => console.log('OK Pressed'),
            },
          ],
        );
        return;
      }
      dispatch(updatePassword(passwordValue));
      navigation.navigate('SignUpUsernameScreen');
    } else {
      Alert.alert(t('signUp:signUpButton'), t('signUp:alertNoMatchPasswords'), [
        {
          text: t('common:tryAgain'),
          onPress: () => console.log('OK Pressed'),
        },
      ]);
    }
  };

  const bottomButton = (
    <View
      style={[styles.container, {position: 'absolute', bottom: 20, zIndex: 1}]}>
      <View style={[styles.buttonRow]}>
        <Button
          content={t('common:continue')}
          variant="solid"
          size="normal"
          fullWidth={true}
          onPress={RegisterPasswordHandler}
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
            {t('signUp:newPasswordTitle')}
          </CustomText>

          <CustomText style={[styles.fontSize.normal, styles.fontWeight.fw300]}>
            {t('signUp:newPasswordDesc')}
          </CustomText>
        </View>

        <View style={{marginTop: METRICS.spaceXXLarge}}>
          <View style={[{marginBottom: METRICS.spaceCompact}]}>
            <Input
              placeholder={t('signUp:newPasswordPlaceholder')}
              text={passwordValue}
              variant="password"
              inputMode="text"
              onChange={onChangePasswordHandler}
            />
          </View>
          <View style={[{marginBottom: METRICS.spaceCompact}]}>
            <Input
              placeholder={t('signUp:confirmPasswordPlaceholder')}
              text={confirmPasswordValue}
              variant="password"
              inputMode="text"
              onChange={onChangeConfirmPasswordHandler}
            />
          </View>
        </View>
      </View>
    </HeroContainer>
  );
}

export default SignUpNewPasswordScreen;
