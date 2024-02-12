import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

import {styles} from '@styles';
import RadioButtonGroup from '@components/atoms/radio_button_group';
import HeroContainer from '@containers/hero_container';

import {ActivityIndicator, I18nManager, View} from 'react-native';
import CustomText from '@components/custom/custom_text';
import Button from '@components/atoms/button';
import {METRICS} from '@theme/metrics';

import {useStateIfMounted} from 'use-state-if-mounted';
import axios from 'axios';

import {useDispatch, useSelector} from 'react-redux';
import {getApplyInfo, getCountry} from '@stores/selectors';
import {setApplyInfo} from '@stores/slices/applyInfo';

import {setDropdownCountries} from '@stores/slices/dropdownCountries';
import {t} from 'i18next';

function JoinUsSelectCountry(props) {
  const dispatch = useDispatch();

  const applyInfo = useSelector(getApplyInfo);
  const appCountry = useSelector(getCountry);
  const navigation = useNavigation();
  const [selected, setSelected] = useStateIfMounted(
    applyInfo.CurrentCountry ? applyInfo.CurrentCountry : appCountry,
  );
  const [options, setOptions] = useStateIfMounted([]);

  const fetchCountries = async () => {
    const res = await axios.get(
      'https://restcountries.com/v3.1/all?fields=name,flags,cca2,idd',
    );

    const includedCountries = [
      'DZ',
      'BH',
      'EG',
      'IQ',
      'JO',
      'KW',
      'LB',
      'LY',
      'MA',
      'OM',
      'PS',
      'QA',
      'SA',
      'SD',
      'SY',
      'TN',
      'AE',
      'US',
      'YE',
    ];

    const mappedCountries = res.data
      .map(countryElement => ({
        label: t(`joinUs:${countryElement.cca2}`),
        value: countryElement.cca2,
        code: countryElement.idd,
        img: countryElement.flags.png,
        isSelected: countryElement.cca2 === selected, // You can set this to true if needed
      }))
      .filter(country => includedCountries.includes(country.value));

    mappedCountries.sort((a, b) => a.label.localeCompare(b.label));
    dispatch(setDropdownCountries(mappedCountries));
    setOptions(mappedCountries);
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const onChangeHandler = value => {
    setSelected(value);
    const mappedCountries = options.map(countryElement => ({
      ...countryElement,
      isSelected: value === countryElement.value, // You can set this to true if needed
    }));

    setOptions(mappedCountries);
  };

  const moveToNextStep = async () => {
    dispatch(
      setApplyInfo({
        FirstName: applyInfo.FirstName,
        LastName: applyInfo.LastName,
        Email: applyInfo.Email,
        Phone: applyInfo.Phone,
        CurrentCountry: selected,
        CurrentCity: applyInfo.CurrentCity,
        Role: applyInfo.Role,
        DOB: applyInfo.DOB,
        Gender: applyInfo.Gender,
        CurrentJob: applyInfo.CurrentJob,
      }),
    );
    navigation.navigate('JoinUsSelectCity');
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
          disabled={selected === ''}
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
            {t('joinUs:selectCountryLabel')}
          </CustomText>
        </View>
        {options.length > 0 ? (
          <RadioButtonGroup
            options={options}
            onChange={onChangeHandler}
            isRemoteImage={true}
          />
        ) : (
          <ActivityIndicator size="large" color="#fff" />
        )}
      </View>
    </HeroContainer>
  );
}

export default JoinUsSelectCountry;
