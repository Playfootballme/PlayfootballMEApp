import React from 'react';
import {useNavigation} from '@react-navigation/native';

import {styles} from '@styles';
import RadioButtonGroup from '@components/atoms/radio_button_group';
import HeroContainer from '@containers/hero_container';

import {I18nManager, View} from 'react-native';
import CustomText from '@components/custom/custom_text';
import Button from '@components/atoms/button';
import {METRICS} from '@theme/metrics';

import {useDispatch, useSelector} from 'react-redux';
import {setApplyInfo} from '@stores/slices/applyInfo';
import {getApplyInfo} from '@stores/selectors';

import {useStateIfMounted} from 'use-state-if-mounted';
import {t} from 'i18next';

function JoinUsSelectRole(props) {
  const dispatch = useDispatch();
  const applyInfo = useSelector(getApplyInfo);
  const navigation = useNavigation();
  const [selected, setSelected] = useStateIfMounted(
    applyInfo.Role || 'Organizer',
  );

  const [options, setOptions] = useStateIfMounted([
    {
      label: t('joinUs:roleOrganizer'),
      value: 'Organizer',
      isSelected: selected === 'Organizer',
    },
    {
      label: t('joinUs:roleReferee'),
      value: 'Referee',
      isSelected: selected === 'Referee',
    },
  ]);

  const onChangeHandler = value => {
    setSelected(value);
    setOptions([
      {
        label: t('joinUs:roleOrganizer'),
        value: 'Organizer',
        isSelected: value === 'Organizer',
      },
      {
        label: t('joinUs:roleReferee'),
        value: 'Referee',
        isSelected: value === 'Referee',
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
        Role: selected,
        DOB: applyInfo.DOB,
        Gender: applyInfo.Gender,
        CurrentJob: applyInfo.CurrentJob,
      }),
    );
    navigation.navigate('JoinUsSelectCountry');
  };
  const onPressBack = () => {
    dispatch(
      setApplyInfo({
        FirstName: null,
        LastName: null,
        Email: null,
        Phone: null,
        CurrentCountry: null,
        CurrentCity: null,
        Role: null,
        Age: null,
        Gender: null,
        CurrentJob: null,
      }),
    );
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
            {t('joinUs:selectRoleLabel')}
          </CustomText>
        </View>
        <RadioButtonGroup options={options} onChange={onChangeHandler} />
      </View>
    </HeroContainer>
  );
}

export default JoinUsSelectRole;
