import React from 'react';
import {useNavigation} from '@react-navigation/native';

import {styles} from '@styles';
import RadioButtonGroup from '@components/atoms/radio_button_group';
import HeroContainer from '@containers/hero_container';

import {I18nManager, View} from 'react-native';
import CustomText from '@components/custom/custom_text';
import Button from '@components/atoms/button';
import {METRICS} from '@theme/metrics';

import {useStateIfMounted} from 'use-state-if-mounted';

import {useDispatch, useSelector} from 'react-redux';
import {getApplyInfo, getMe} from '@stores/selectors';
import {setApplyInfo} from '@stores/slices/applyInfo';
import {t} from 'i18next';

function JoinUsSelectGender(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const applyInfo = useSelector(getApplyInfo);
  const Me = useSelector(getMe);

  const [selected, setSelected] = useStateIfMounted(
    applyInfo.Gender || Me?.data?.Gender || 'Male',
  );
  const [options, setOptions] = useStateIfMounted([
    {
      label: t('common:genderMale'),
      value: 'Male',
      isSelected: selected === 'Male',
    },
    {
      label: t('common:genderFemale'),
      value: 'Female',
      isSelected: selected === 'Female',
    },
  ]);

  const onChangeHandler = value => {
    setSelected(value);
    setOptions([
      {
        label: t('common:genderMale'),
        value: 'Male',
        isSelected: value === 'Male',
      },
      {
        label: t('common:genderFemale'),
        value: 'Female',
        isSelected: value === 'Female',
      },
    ]);
  };

  const moveToNextStep = async () => {
    dispatch(
      setApplyInfo({
        FirstName: applyInfo.FirstName,
        LastName: applyInfo.LastName,
        Email: applyInfo.Email,
        Phone: applyInfo.Phone,
        CurrentCountry: applyInfo.CurrentCountry,
        CurrentCity: applyInfo.CurrentCity,
        Role: applyInfo.Role,
        DOB: applyInfo.DOB,
        Gender: selected,
        CurrentJob: applyInfo.CurrentJob,
      }),
    );
    navigation.navigate('JoinUsName');
  };
  const onPressBack = () => {
    navigation.goBack();
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
          onPress={moveToNextStep}
        />
      </View>
    </View>
  );

  return (
    <HeroContainer
      title={t('more:joinOurTeamLabelSmall')}
      onPressBack={onPressBack}
      bottomButton={bottomButton}>
      <View style={[styles.container, styles.flex]}>
        <View
          style={{
            marginVertical: METRICS.spaceNormal,
            alignItems: 'flex-start',
          }}>
          <CustomText style={[styles.fontSize.normal, styles.fontWeight.fw600]}>
            {t('common:selectGenderLabel')}
          </CustomText>
        </View>
        <RadioButtonGroup options={options} onChange={onChangeHandler} />
      </View>
    </HeroContainer>
  );
}

export default JoinUsSelectGender;
