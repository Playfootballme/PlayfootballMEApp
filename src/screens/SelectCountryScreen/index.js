import React from 'react';
import {useNavigation} from '@react-navigation/native';

import LandingContainer from '@containers/landing_container';
import {styles} from '@styles';

import {View} from 'react-native';
import CustomText from '@components/custom/custom_text';
import Button from '@components/atoms/button';
import {METRICS} from '@theme/metrics';
import RadioButtonGroup from '@components/atoms/radio_button_group';
import {storeData} from '@config/functions';
import {useDispatch} from 'react-redux';
import {setCountry, setCurrency, setTimezone} from '@stores/slices/country';

import {
  fetchTodayAndTomorrowMatches,
  fetchAnnouncements,
} from '@stores/services';
import {useStateIfMounted} from 'use-state-if-mounted';
import {t} from 'i18next';

function SelectCountryScreen(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [selected, setSelected] = useStateIfMounted('JO');
  const [countries, setCountries] = useStateIfMounted([
    {
      label: t('more:countryJordan'),
      img: require('@assets/images/jordan.png'),
      value: 'JO',
      isSelected: selected === 'JO',
    },
    {
      label: t('more:countryQatar'),
      img: require('@assets/images/qatar.png'),
      value: 'QA',
      isSelected: selected === 'QA',
    },
  ]);

  const onChangeHandler = value => {
    setSelected(value);
    setCountries([
      {
        label: t('more:countryJordan'),
        img: require('@assets/images/jordan.png'),
        value: 'JO',
        isSelected: value === 'JO',
      },
      {
        label: t('more:countryQatar'),
        img: require('@assets/images/qatar.png'),
        value: 'QA',
        isSelected: value === 'QA',
      },
    ]);
  };

  const moveToNextStep = async () => {
    await storeData('countryCode', JSON.stringify(selected));
    dispatch(setCountry(selected));
    dispatch(setCurrency(selected === 'JO' ? 'JOD' : 'QR'));
    dispatch(setTimezone(selected === 'JO' ? 3 : 3));
    dispatch(fetchTodayAndTomorrowMatches(selected, 1));
    dispatch(fetchAnnouncements(selected));
    navigation.navigate('LandingScreen');
  };
  return (
    <LandingContainer scroll={false}>
      <View style={[styles.container, styles.flex]}>
        <View style={{marginTop: METRICS.spaceNormal}}>
          <CustomText
            style={[styles.fontSize.compact, styles.fontWeight.fw600]}>
            {t('common:selectCountryTitle')}
          </CustomText>
        </View>
        <RadioButtonGroup options={countries} onChange={onChangeHandler} />
        <View style={[{position: 'absolute', left: 0, bottom: 20, zIndex: 1}]}>
          <View style={[styles.buttonRow]}>
            <Button
              content={t('common:continue')}
              variant="solid"
              size="normal"
              fullWidth={true}
              onPress={() => {
                moveToNextStep();
              }}
            />
          </View>
        </View>
      </View>
    </LandingContainer>
  );
}

export default SelectCountryScreen;
