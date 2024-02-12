import React from 'react';
import {useNavigation, CommonActions} from '@react-navigation/native';

import HeroContainer from '@containers/hero_container';

import {styles} from '@styles';
import {Alert, View} from 'react-native';
import CustomText from '@components/custom/custom_text';
import {METRICS} from '@theme/metrics';
import Button from '@components/atoms/button';
import RadioButtonGroup from '@components/atoms/radio_button_group';
import {updatePrefPos} from '@stores/slices/registrationSteps';
import {useDispatch} from 'react-redux';

import {useStateIfMounted} from 'use-state-if-mounted';
import {t} from 'i18next';

function SignUpPrefPosScreen(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [selectedPos, setSelectedPos] = useStateIfMounted('GK');

  const prefPosOptions = [
    {
      label: t('profile:preferedPosGK'),
      value: 'GK',
      isSelected: selectedPos === 'GK',
    },
    {
      label: t('profile:preferedPosDEF'),
      value: 'DEF',
      isSelected: selectedPos === 'DEF',
    },
    {
      label: t('profile:preferedPosMID'),
      value: 'MID',
      isSelected: selectedPos === 'MID',
    },
    {
      label: t('profile:preferedPosATT'),
      value: 'ATT',
      isSelected: selectedPos === 'ATT',
    },
  ];

  const onPressBack = () => {
    navigation.goBack();
  };

  const onChangePosHandler = value => {
    setSelectedPos(value);
  };

  const RegisterPrefPosHandler = () => {
    dispatch(updatePrefPos(selectedPos));
    navigation.navigate('SignUpGenderScreen');
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
          onPress={RegisterPrefPosHandler}
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
            {t('profile:preferedPosTitle')}
          </CustomText>
        </View>

        <View style={{marginTop: METRICS.spaceXXLarge}}>
          <View style={styles.buttonRowFirst}>
            <RadioButtonGroup
              options={prefPosOptions}
              onChange={onChangePosHandler}
            />
          </View>
        </View>
      </View>
    </HeroContainer>
  );
}

export default SignUpPrefPosScreen;
