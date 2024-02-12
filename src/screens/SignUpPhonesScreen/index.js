import React from 'react';
import {useNavigation} from '@react-navigation/native';

import HeroContainer from '@containers/hero_container';

import {View, Alert, TouchableOpacity, I18nManager} from 'react-native';
import CustomText from '@components/custom/custom_text';
import {METRICS} from '@theme/metrics';
import Button from '@components/atoms/button';
import Input from '@components/atoms/input';
import {useDispatch} from 'react-redux';
import {
  updatePhone,
  updateEmergencyPhone,
} from '@stores/slices/registrationSteps';
import {PhoneAvailability} from '@config/functions';
import RadioButtonGroup from '@components/atoms/radio_button_group';

import {styles} from '@styles';
import {useStateIfMounted} from 'use-state-if-mounted';
import {t} from 'i18next';

function SignUpPhonesScreen(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [phoneValue, setPhoneValue] = useStateIfMounted('');
  const [emrPhoneValue, setEmrPhoneValue] = useStateIfMounted('');
  const [modalIsActive, setModalIsActive] = useStateIfMounted(false);

  const [phoneCountryCode, setPhoneCountryCountryCode] = useStateIfMounted(962);
  const [emergCountryCode, setEmergCountryCountryCode] = useStateIfMounted(962);
  const [modalOptions, setModalOptions] = useStateIfMounted([]);
  const [isEmer, setIsEmer] = useStateIfMounted(false);

  const onPressBack = () => {
    navigation.goBack();
  };

  const onChangePhoneHandler = text => {
    setPhoneValue(text);
  };

  const onChangeEmrPhoneHandler = text => {
    setEmrPhoneValue(text);
  };

  const RegisterPhoneHandler = async () => {
    const jordanianRegex = /^7[789]\d{7}$/;
    const qatariRegex = /^(3|4|5|6|7)\d{7}$/;

    if (
      phoneCountryCode + phoneValue === '' ||
      emergCountryCode + emrPhoneValue === ''
    ) {
      Alert.alert(t('signUp:signUpButton'), t('common:enterPhoneNumber'), [
        {
          text: t('common:tryAgain'),
          onPress: () => console.log(t('common:tryAgain')),
        },
      ]);
      return;
    }

    if (phoneValue.length < 9) {
      if (phoneCountryCode === 962) {
        Alert.alert(
          t('signUp:signUpButton'),
          `${t('common:phoneNumberTitle')} ${phoneCountryCode + phoneValue} ${t(
            'common:phoneNumberShort',
          )}`,
          [
            {
              text: t('common:tryAgain'),
              onPress: () => console.log(t('common:tryAgain')),
            },
          ],
        );
        return;
      }

      if (phoneCountryCode === 974 && phoneValue.length < 8) {
        Alert.alert(
          t('signUp:signUpButton'),
          `${t('common:phoneNumberTitle')} ${phoneCountryCode + phoneValue} ${t(
            'common:phoneNumberShort',
          )}`,
          [
            {
              text: t('common:tryAgain'),
              onPress: () => console.log(t('common:tryAgain')),
            },
          ],
        );
        return;
      }
    }

    if (emrPhoneValue.length < 9) {
      if (emergCountryCode === 962) {
        Alert.alert(
          t('signUp:signUpButton'),
          `${t('common:phoneNumberTitle')} ${
            emergCountryCode + emrPhoneValue
          } ${t('common:phoneNumberShort')}`,
          [
            {
              text: t('common:tryAgain'),
              onPress: () => console.log(t('common:tryAgain')),
            },
          ],
        );
        return;
      }

      if (emergCountryCode === 974 && emrPhoneValue.length < 8) {
        Alert.alert(
          t('signUp:signUpButton'),
          `${t('common:phoneNumberTitle')} ${
            emergCountryCode + emrPhoneValue
          } ${t('common:phoneNumberShort')}`,
          [
            {
              text: t('common:tryAgain'),
              onPress: () => console.log(t('common:tryAgain')),
            },
          ],
        );
        return;
      }
    }

    if (phoneValue.length > 9) {
      Alert.alert(
        t('signUp:signUpButton'),
        `${t('common:phoneNumberTitle')} ${phoneCountryCode + phoneValue} ${t(
          'common:phoneNumberLong',
        )}`,
        [
          {
            text: t('common:tryAgain'),
            onPress: () => console.log(t('common:tryAgain')),
          },
        ],
      );
      return;
    }

    if (emrPhoneValue.length > 9) {
      Alert.alert(
        t('signUp:signUpButton'),
        `${t('common:phoneNumberTitle')} ${
          phoneCountryCode + emrPhoneValue
        } ${t('common:phoneNumberLong')}`,
        [
          {
            text: t('common:tryAgain'),
            onPress: () => console.log(t('common:tryAgain')),
          },
        ],
      );
      return;
    }

    if (phoneCountryCode + phoneValue === emergCountryCode + emrPhoneValue) {
      Alert.alert(t('signUp:signUpButton'), t('common:emergencyPhoneNotSame'), [
        {
          text: t('common:tryAgain'),
          onPress: () => console.log(t('common:tryAgain')),
        },
      ]);
      return;
    }

    if (phoneCountryCode === 962) {
      if (!jordanianRegex.test(phoneValue)) {
        Alert.alert(
          t('signUp:signUpButton'),
          `${t('common:phoneNumberTitle')} ${phoneCountryCode + phoneValue} ${t(
            'common:phoneNumberNotJordanian',
          )}`,
          [
            {
              text: t('common:tryAgain'),
              onPress: () => console.log(t('common:tryAgain')),
            },
          ],
        );
        return;
      }
    }

    if (emergCountryCode === 962) {
      if (!jordanianRegex.test(emrPhoneValue)) {
        Alert.alert(
          t('signUp:signUpButton'),
          `${t('common:phoneNumberTitle')} ${
            emergCountryCode + emrPhoneValue
          } ${t('common:phoneNumberNotJordanian')}`,
          [
            {
              text: t('common:tryAgain'),
              onPress: () => console.log(t('common:tryAgain')),
            },
          ],
        );
        return;
      }
    }

    if (phoneCountryCode === 974) {
      if (!qatariRegex.test(phoneValue)) {
        Alert.alert(
          t('signUp:signUpButton'),
          `${t('common:phoneNumberTitle')} ${phoneCountryCode + phoneValue} ${t(
            'common:phoneNumberNotQatari',
          )}`,
          [
            {
              text: t('common:tryAgain'),
              onPress: () => console.log(t('common:tryAgain')),
            },
          ],
        );
        return;
      }
    }

    if (emergCountryCode === 974) {
      if (!qatariRegex.test(emrPhoneValue)) {
        Alert.alert(
          t('signUp:signUpButton'),
          `${t('common:phoneNumberTitle')} ${
            emergCountryCode + emrPhoneValue
          } ${t('common:phoneNumberNotQatari')}`,
          [
            {
              text: t('common:tryAgain'),
              onPress: () => console.log(t('common:tryAgain')),
            },
          ],
        );
        return;
      }
    }

    const phoneAvailability = await PhoneAvailability(
      phoneCountryCode + phoneValue,
    );
    if (phoneAvailability.data.length > 0) {
      Alert.alert(
        t('signUp:signUpButton'),
        t('common:phoneNumberAlreadyInUser'),
        [
          {
            text: t('common:tryAgain'),
            onPress: () => console.log(t('common:tryAgain')),
          },
        ],
      );
      return;
    }

    dispatch(updatePhone(phoneCountryCode + phoneValue));
    dispatch(updateEmergencyPhone(emergCountryCode + emrPhoneValue));
    navigation.navigate('SignUpAgeScreen');
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
          onPress={RegisterPhoneHandler}
        />
      </View>
    </View>
  );

  const dispatchHandler = (value, isEmerValue = false) => {
    setIsEmer(isEmerValue);
    setModalIsActive(!modalIsActive);
    setModalOptions([
      {
        label: `${t('more:countryJordan')} (+962)`,
        value: 962,
        img: require('@assets/images/jordan.png'),
        isSelected: value === 962,
      },
      {
        label: `${t('more:countryQatar')} (+974)`,
        value: 974,
        img: require('@assets/images/qatar.png'),
        isSelected: value === 974,
      },
    ]);
  };

  const onChangeHandler = value => {
    if (isEmer) {
      setEmergCountryCountryCode(value);
    } else {
      setPhoneCountryCountryCode(value);
    }

    setModalIsActive(!modalIsActive);
  };

  const modalBody = (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
      <View>
        <CustomText
          style={[
            styles.fontSize.compact,
            styles.fontWeight.fw600,
            {marginBottom: METRICS.spaceSmall},
          ]}>
          {t('common:selectCountryCodeTitle')}
        </CustomText>
      </View>

      <View style={styles.buttonRowFirst}>
        <RadioButtonGroup options={modalOptions} onChange={onChangeHandler} />
      </View>
    </View>
  );

  return (
    <HeroContainer
      title={t('signUp:signUpButton')}
      onPressBack={onPressBack}
      bottomButton={bottomButton}
      modalIsActive={modalIsActive}
      setModalIsActive={() => {
        setModalIsActive(!modalIsActive);
      }}
      modalStyle={'halfWithEdge'}
      modalBody={modalBody}>
      <View style={[styles.container]}>
        <View style={{marginTop: METRICS.spaceNormal}}>
          <CustomText
            style={[
              styles.fontSize.large,
              styles.fontWeight.fw600,
              {marginBottom: METRICS.spaceSmall},
            ]}>
            {t('signUp:contactNumberTitle')}
          </CustomText>
        </View>

        <View style={{marginTop: METRICS.spaceXXLarge}}>
          <View
            style={[
              {
                marginBottom: METRICS.spaceCompact,
                flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
              },
              styles.countryCodeWrapper,
            ]}>
            <TouchableOpacity
              style={styles.countryCode}
              onPress={() => {
                dispatchHandler(phoneCountryCode);
              }}>
              <CustomText>{`+${phoneCountryCode}`}</CustomText>
            </TouchableOpacity>
            <Input
              hasCountryCode={true}
              placeholder={t('signUp:contactNumberPleaceholder')}
              inputMode="numeric"
              text={phoneValue}
              onChange={onChangePhoneHandler}
            />
          </View>
          <View
            style={[
              styles.countryCodeWrapper,
              {flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row'},
            ]}>
            <TouchableOpacity
              style={styles.countryCode}
              onPress={() => {
                dispatchHandler(emergCountryCode, true);
              }}>
              <CustomText>{`+${emergCountryCode}`}</CustomText>
            </TouchableOpacity>
            <Input
              hasCountryCode={true}
              placeholder={t('signUp:emerContactNumberPleaceholder')}
              inputMode="numeric"
              text={emrPhoneValue}
              onChange={onChangeEmrPhoneHandler}
            />
          </View>
          <CustomText
            style={[
              styles.fontSize.small,
              ,
              {
                textAlign: 'right',
                marginTop: METRICS.spaceTiny,
              },
            ]}>
            {t('signUp:emerContactNumberDesc')}
          </CustomText>
        </View>
      </View>
    </HeroContainer>
  );
}

export default SignUpPhonesScreen;
