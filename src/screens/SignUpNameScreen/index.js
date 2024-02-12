import React from 'react';
import {useNavigation} from '@react-navigation/native';

import HeroContainer from '@containers/hero_container';

import {styles} from '@styles';
import {View, Alert} from 'react-native';
import CustomText from '@components/custom/custom_text';
import {METRICS} from '@theme/metrics';
import Button from '@components/atoms/button';
import Input from '@components/atoms/input';
import {useDispatch} from 'react-redux';
import {
  updateFirstName,
  updateLastName,
} from '@stores/slices/registrationSteps';
import {useStateIfMounted} from 'use-state-if-mounted';
import {t} from 'i18next';

function SignUpNameScreen(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [firstNameValue, setFirstNameValue] = useStateIfMounted('');
  const [lastNameValue, setLastNameValue] = useStateIfMounted('');

  const onPressBack = () => {
    navigation.goBack();
  };

  const onChangeFirstNameHandler = text => {
    setFirstNameValue(text);
  };

  const onChangeLastNameHandler = text => {
    setLastNameValue(text);
  };

  const RegisterNameHandler = () => {
    if (firstNameValue === '' || lastNameValue === '') {
      Alert.alert(t('signUp:signUpButton'), t('signUp:alertEmptyName'), [
        {
          text: t('common:tryAgain'),
          onPress: () => console.log(t('common:tryAgain')),
        },
      ]);
      return;
    }
    dispatch(updateFirstName(firstNameValue.trim()));
    dispatch(updateLastName(lastNameValue.trim()));
    navigation.navigate('SignUpPhonesScreen');
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
          onPress={RegisterNameHandler}
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
            {t('signUp:newNameTitle')}
          </CustomText>

          <CustomText style={[styles.fontSize.normal, styles.fontWeight.fw300]}>
            {t('signUp:newNameDesc')}
          </CustomText>
        </View>

        <View style={{marginTop: METRICS.spaceXXLarge}}>
          <View style={[{marginBottom: METRICS.spaceCompact}]}>
            <Input
              placeholder={t('common:firstNamePlaceholder')}
              inputMode="text"
              text={firstNameValue}
              onChange={onChangeFirstNameHandler}
            />
          </View>
          <View style={[{marginBottom: METRICS.spaceCompact}]}>
            <Input
              placeholder={t('common:lastNamePlaceholder')}
              inputMode="text"
              text={lastNameValue}
              onChange={onChangeLastNameHandler}
            />
          </View>
        </View>
      </View>
    </HeroContainer>
  );
}

export default SignUpNameScreen;
