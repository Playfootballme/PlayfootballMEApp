import React from 'react';
import {useNavigation} from '@react-navigation/native';

import {styles} from '@styles';
import HeroContainer from '@containers/hero_container';

import {
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  I18nManager,
} from 'react-native';
import CustomText from '@components/custom/custom_text';
import Button from '@components/atoms/button';
import {METRICS} from '@theme/metrics';
import {useStateIfMounted} from 'use-state-if-mounted';
import Input from '@components/atoms/input';
import RadioButtonGroup from '@components/atoms/radio_button_group';
import {emailRegex} from '@config/functions';

import {useDispatch, useSelector} from 'react-redux';
import {getApplyInfo, getDropdownCountries} from '@stores/selectors';
import {setApplyInfo} from '@stores/slices/applyInfo';
import {t} from 'i18next';

function JoinUsContact(props) {
  const dispatch = useDispatch();
  const countries = useSelector(getDropdownCountries);
  const applyInfo = useSelector(getApplyInfo);
  let current_code = countries.find(
    code_country => code_country.value === applyInfo.CurrentCountry,
  ).code;

  current_code =
    current_code.suffixes.length > 1
      ? current_code.root
      : current_code.root + current_code.suffixes[0];

  const [the_code, setCode] = useStateIfMounted(current_code);

  const checkCountryCode = (countryElement, countryCode) => {
    const code_to_check =
      countryElement.code.suffixes.length > 1
        ? countryElement.code.root
        : countryElement.code.root + countryElement.code.suffixes[0];
    return code_to_check === countryCode;
  };

  const dial_code_countries = countries.map(countryElement => ({
    label:
      countryElement.code.suffixes.length > 1
        ? `${countryElement.label} (${countryElement.code.root})`
        : `${countryElement.label} (${
            countryElement.code.root + countryElement.code.suffixes[0]
          })`,
    value:
      countryElement.code.suffixes.length > 1
        ? countryElement.code.root
        : countryElement.code.root + countryElement.code.suffixes[0],
    code: countryElement.code,
    img: countryElement.img,
    isSelected: checkCountryCode(countryElement, the_code), // You can set this to true if needed
  }));

  const [options, setOptions] = useStateIfMounted(dial_code_countries);

  const removePrefix = numOrStr => {
    numOrStr = numOrStr?.toString();
    if (numOrStr?.startsWith(the_code)) {
      return numOrStr?.substring(the_code.length);
    }
  };

  const navigation = useNavigation();
  const [loading, setLoading] = useStateIfMounted(false);
  const [phone, setPhone] = useStateIfMounted(removePrefix(applyInfo.Phone));
  const [email, setEmail] = useStateIfMounted(applyInfo.Email);
  const [modalIsActive, setModalIsActive] = useStateIfMounted(false);

  const onChangePhoneHandler = newValue => {
    setPhone(newValue);
  };
  const onChangeEmailHandler = newValue => {
    setEmail(newValue);
  };

  const countryCodeChangeHandler = value => {
    setCode(value);
    const mappedCountries = options.map(countryElement => ({
      ...countryElement,
      isSelected: value === countryElement.value, // You can set this to true if needed
    }));

    setOptions(mappedCountries);
  };

  const moveToNextStep = async () => {
    setLoading(true);
    if (email.length === 0) {
      Alert.alert(t('more:joinOurTeamLabelSmall'), t('common:enterYourEmail'), [
        {text: t('common:tryAgain'), onPress: () => setLoading(false)},
      ]);
      return;
    }

    if (!emailRegex.test(email)) {
      Alert.alert(
        t('more:joinOurTeamLabelSmall'),
        t('common:enterValidEmail'),
        [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
      );
      return;
    }

    dispatch(
      setApplyInfo({
        FirstName: applyInfo.FirstName,
        LastName: applyInfo.LastName,
        Email: email,
        Phone: the_code + phone,
        CurrentCountry: applyInfo.CurrentCountry,
        CurrentCity: applyInfo.CurrentCity,
        Role: applyInfo.Role,
        DOB: applyInfo.DOB,
        Gender: applyInfo.Gender,
        CurrentJob: applyInfo.CurrentJob,
      }),
    );
    navigation.navigate('JoinUsPreview');
  };
  const onPressBack = () => {
    navigation.goBack();
  };

  const countryModalBody = (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
      <View style={{alignItems: 'flex-start'}}>
        <CustomText
          style={[
            styles.fontSize.compact,
            styles.fontWeight.fw600,
            {marginBottom: METRICS.spaceSmall},
          ]}>
          {t('joinUs:selectCountryCodeLabel')}
        </CustomText>
      </View>

      <ScrollView style={styles.buttonRowFirst}>
        <RadioButtonGroup
          options={options}
          onChange={countryCodeChangeHandler}
          isRemoteImage={true}
        />
      </ScrollView>
    </View>
  );

  const bottomButton = (
    <View
      style={[styles.container, {position: 'absolute', bottom: 20, zIndex: 1}]}>
      <View style={[styles.buttonRow]}>
        <Button
          content={t('joinUs:previewButton')}
          disabled={!(phone && email) || loading}
          loading={loading}
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
      bottomButton={bottomButton}
      modalIsActive={modalIsActive}
      setModalIsActive={() => setModalIsActive(!modalIsActive)}
      modalStyle={'fullWithEdge'}
      modalBody={countryModalBody}>
      <View style={[styles.container, styles.flex]}>
        <View
          style={{
            marginVertical: METRICS.spaceNormal,
            alignItems: 'flex-start',
          }}>
          <CustomText style={[styles.fontSize.normal, styles.fontWeight.fw600]}>
            {t('joinUs:contactInfoLabel')}
          </CustomText>
        </View>

        <View
          style={[
            {
              marginBottom: METRICS.spaceNormal,
              flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
            },
            styles.countryCodeWrapper,
          ]}>
          <TouchableOpacity
            style={styles.countryCode}
            onPress={() => {
              setModalIsActive(!modalIsActive);
            }}>
            <CustomText>{the_code}</CustomText>
          </TouchableOpacity>
          <Input
            hasCountryCode={true}
            placeholder={t('common:phoneNumberPlaceholder')}
            inputMode="numeric"
            text={phone}
            onChange={onChangePhoneHandler}
          />
        </View>

        <Input
          text={email}
          inputMode={'email'}
          placeholder={t('common:emailPlaceholder')}
          onChange={onChangeEmailHandler}
        />
      </View>
    </HeroContainer>
  );
}

export default JoinUsContact;
