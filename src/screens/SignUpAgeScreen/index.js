import React, {lazy, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import HeroContainer from '@containers/hero_container';

import {styles} from '@styles';
import {View, Alert} from 'react-native';
import CustomText from '@components/custom/custom_text';
import {METRICS} from '@theme/metrics';
import Button from '@components/atoms/button';
import {useDispatch, useSelector} from 'react-redux';
import {updateDOB} from '@stores/slices/registrationSteps';
import {t} from 'i18next';
const LazyDatePicker = lazy(() => import('react-native-date-picker'));

import {getLanguage} from '@stores/selectors';
import moment from 'moment';
function SignUpAgeScreen(props) {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const dispatch = useDispatch();
  const [ageValue, setAgeValue] = useState('');

  const currentLang = useSelector(getLanguage);

  const onPressBack = () => {
    navigation.goBack();
  };

  const onChangeAgeValue = text => {
    setAgeValue(text);
  };

  const RegisterAgeHandler = () => {
    if (date === '') {
      Alert.alert(t('signUp:signUpButton'), t('profile:dobDesc'), [
        {
          text: t('common:tryAgain'),
          onPress: () => console.log(t('common:tryAgain')),
        },
      ]);
      return;
    }
    dispatch(updateDOB(moment(date).locale('en-gb').format('YYYY-MM-DD')));
    navigation.navigate('SignUpPrefPosScreen');
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
          onPress={RegisterAgeHandler}
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
            {t('profile:dobDesc')}
          </CustomText>
        </View>

        <View style={[{marginTop: METRICS.spaceXXLarge}, styles.alignCenter]}>
          <LazyDatePicker
            date={date ? new Date(date) : new Date()}
            onDateChange={setDate}
            maximumDate={new Date()}
            androidVariant="iosClone"
            fadeToColor="none"
            mode="date"
            textColor="#fff"
            locale={currentLang}
          />
        </View>
      </View>
    </HeroContainer>
  );
}

export default SignUpAgeScreen;
