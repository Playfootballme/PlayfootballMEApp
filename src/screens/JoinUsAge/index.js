import React from 'react';
import {useNavigation} from '@react-navigation/native';

import {styles} from '@styles';
import HeroContainer from '@containers/hero_container';

import {View} from 'react-native';
import CustomText from '@components/custom/custom_text';
import Button from '@components/atoms/button';
import {METRICS} from '@theme/metrics';

import {useStateIfMounted} from 'use-state-if-mounted';

import {useDispatch, useSelector} from 'react-redux';
import {getApplyInfo, getLanguage} from '@stores/selectors';
import {setApplyInfo} from '@stores/slices/applyInfo';
import {t} from 'i18next';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

function JoinUsAge(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const applyInfo = useSelector(getApplyInfo);
  const currentLang = useSelector(getLanguage);
  const [value, setValue] = useStateIfMounted(applyInfo.DOB);

  const onChangeHandler = newValue => {
    setValue(newValue);
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
        DOB: moment(value).format('YYYY-MM-DD'),
        Gender: applyInfo.Gender,
        CurrentJob: applyInfo.CurrentJob,
      }),
    );

    navigation.navigate('JoinUsCurrentJob');
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
          disabled={value === ''}
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
            {t('joinUs:dobLabel')}
          </CustomText>
        </View>
        <View style={[styles.alignCenter]}>
          <DatePicker
            date={value ? new Date(value) : new Date()}
            onDateChange={setValue}
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

export default JoinUsAge;
