import React, {lazy, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import HeroContainer from '@containers/hero_container';
import {Alert, I18nManager, TouchableOpacity, View} from 'react-native';
import {METRICS} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import {styles} from '@styles';
import CustomText from '@components/custom/custom_text';
import Avatar from '@components/atoms/avatar';
import Button from '@components/atoms/button';
import Input from '@components/atoms/input';
import Icon from '@components/atoms/icon';
import {useSelector} from 'react-redux';
import {getMe, getLanguage, getCountry} from '@stores/selectors';
import {fetchMe} from '@stores/services';
import {useDispatch} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';

import {setUserImage} from '@stores/slices/authUser';

import RadioButtonGroup from '@components/atoms/radio_button_group';
import {logout} from '@stores/slices/authUser';
import RNRestart from 'react-native-restart';

import {
  rootURL,
  PhoneAvailability,
  UsernameAvailability,
  UpdateName,
  UpdateUsername,
  UpdatePhone,
  UpdateEmergencyPhone,
  UpdateDOB,
  UpdateGender,
  FetchMe,
  UpdateProfilePicture,
  removeData,
  DeleteUser,
  apiEndpoint,
  FindMatchesStats,
} from '@config/functions';

import moment from 'moment';
import {t} from 'i18next';
const LazyDatePicker = lazy(() => import('react-native-date-picker'));

import {UpdatePreferredPosition} from '@config/functions';
import PlayerStats from '@components/atoms/player_stats';

function ProfileScreen(props) {
  const currentLang = useSelector(getLanguage);
  const removePrefix = numOrStr => {
    numOrStr = numOrStr.toString();
    if (numOrStr.startsWith('962')) {
      return numOrStr.substring(3);
    } else if (numOrStr.startsWith('974')) {
      return numOrStr.substring(3);
    } else {
      return numOrStr;
    }
  };

  const getPrefix = numOrStr => {
    numOrStr = numOrStr.toString();
    if (numOrStr.startsWith('962')) {
      return 962;
    } else if (numOrStr.startsWith('974')) {
      return 974;
    } else {
      return null;
    }
  };
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const Me = useSelector(getMe);
  const countryCode = useSelector(getCountry);

  const [modalTitle, setModalTitle] = useState(''); // ['Language', 'Theme'
  const [modalIsActive, setModalIsActive] = useState(false);
  const [modalDescription, setModalDescription] = useState(''); // ['Select your preferred language', 'Select your preferred theme'
  const [modalValue, setModalValue] = useState(null);
  const [hasValue2, setHasValue2] = useState(false);
  const [modalValue2, setModalValue2] = useState('');
  const [inputMode, setInputMode] = useState('text');
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [apiCall, setApiCall] = useState(-1);

  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  //country
  const [countryModalActive, setCountryModalActive] = useState(false);
  const [modalOptions, setModalOptions] = useState([]);

  const [phoneCountryCode, setPhoneCountryCode] = useState(
    getPrefix(Me.data.Phone) ? getPrefix(Me.data.Phone) : 962,
  );

  const [emergencyCountryCode, setEmergencyCountryCode] = useState(
    getPrefix(Me.data.EmergencyPhone) ? getPrefix(Me.data.EmergencyPhone) : 962,
  );

  const onChangeHandler = text => {
    setModalValue(text.trim());
  };

  const onChangeHandler2 = text => {
    setModalValue2(text.trim());
  };

  const countryCodeChangeHandler = value => {
    if (apiCall === 3) setPhoneCountryCode(value);
    if (apiCall === 4) setEmergencyCountryCode(value);

    setCountryModalActive(!countryModalActive);
  };

  const onSaveHandler = async () => {
    setLoading(true);
    if (apiCall > 0) {
      //if 1 update name
      //if 2 update username
      //if 3 update phone
      //if 4 update emergecy phone
      //if 5 update age

      if (apiCall === 1) {
        const updateRes = await UpdateName(
          Me.data.id,
          Me?.jwt,
          modalValue,
          modalValue2,
        );
        if (updateRes.status === 200) {
          dispatch(fetchMe(Me?.jwt));
          setModalIsActive(!modalIsActive);
          setTimeout(() => {
            setModalValue(null);
            setModalDescription('');
            setModalTitle('');
            setModalValue2('');
            setHasValue2(false);
            setIsReadOnly(false);
            setInputMode('text');
            setApiCall(-1);
          }, 500);
          setLoading(false);
        } else {
          Alert.alert(
            t('profile:alertNameTitle'),
            t('common:somethingWentWrong'),
            [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
          );
        }
      }

      if (apiCall === 2) {
        if (modalValue.length === 0) {
          Alert.alert(
            t('profile:alertUsernameTitle'),
            t('common:usernameEmpty'),
            [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
          );
          return;
        }
        const noSpacesRegex = /^\S+$/;
        if (!noSpacesRegex.test(modalValue)) {
          Alert.alert(
            t('profile:alertUsernameTitle'),
            t('common:usernameNoSpaces'),
            [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
          );
          return;
        }

        const username_here = await UsernameAvailability(modalValue);
        if (username_here.data.length > 0) {
          if (modalValue.toLowerCase() !== Me.data.username.toLowerCase()) {
            Alert.alert(
              t('profile:alertUsernameTitle'),
              t('common:usernameAlreadyInUse'),
              [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
            );
            return;
          }
        }
        const updateRes = await UpdateUsername(Me.data.id, Me?.jwt, modalValue);
        if (updateRes.status === 200) {
          dispatch(fetchMe(Me?.jwt));
          setModalIsActive(!modalIsActive);
          setTimeout(() => {
            setModalValue(null);
            setModalDescription('');
            setModalTitle('');
            setModalValue2('');
            setHasValue2(false);
            setIsReadOnly(false);
            setInputMode('text');
            setApiCall(-1);
          }, 500);

          setLoading(false);
        } else {
          Alert.alert(
            t('profile:alertUsernameTitle'),
            t('common:somethingWentWrong'),
            [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
          );
        }
      }

      if (apiCall === 3) {
        const jordanianRegex = /^7[789]\d{7}$/;
        const qatariRegex = /^(3|4|5|6|7)\d{7}$/;

        if (modalValue === '') {
          Alert.alert(
            t('profile:alertPhoneNumberTitle'),
            t('common:enterPhoneNumber'),
            [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
          );
          return;
        }

        if (modalValue.length < 9) {
          if (phoneCountryCode === 962) {
            Alert.alert(
              t('profile:alertPhoneNumberTitle'),
              `${t('common:phoneNumberTitle')} ${
                phoneCountryCode + modalValue
              } ${t('common:phoneNumberShort')}`,
              [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
            );
            return;
          }

          if (phoneCountryCode === 974 && modalValue.length < 8) {
            Alert.alert(
              t('profile:alertPhoneNumberTitle'),
              `${t('common:phoneNumberTitle')} ${
                phoneCountryCode + modalValue
              } ${t('common:phoneNumberShort')}`,
              [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
            );
            return;
          }
        }

        if (modalValue.length > 9) {
          Alert.alert(
            t('profile:alertPhoneNumberTitle'),
            `${t('common:phoneNumberTitle')} ${
              phoneCountryCode + modalValue
            } ${t('common:phoneNumberLong')}`,
            [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
          );
          return;
        }

        if (phoneCountryCode === 962) {
          if (!jordanianRegex.test(modalValue)) {
            Alert.alert(
              t('profile:alertPhoneNumberTitle'),
              `${t('common:phoneNumberTitle')} ${
                phoneCountryCode + modalValue
              } ${t('common:phoneNumberNotJordanian')}`,
              [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
            );
            return;
          }
        }

        if (phoneCountryCode === 974) {
          if (!qatariRegex.test(modalValue)) {
            Alert.alert(
              t('profile:alertPhoneNumberTitle'),
              `${t('common:phoneNumberTitle')} ${
                phoneCountryCode + modalValue
              } ${t('common:phoneNumberNotQatari')}`,
              [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
            );
            return;
          }
        }
        const isValid = await PhoneAvailability(
          Number(phoneCountryCode + modalValue),
        );
        if (isValid.data.length === 0) {
          const updateRes = await UpdatePhone(
            Me.data.id,
            Me?.jwt,
            Number(phoneCountryCode + modalValue),
          );
          if (updateRes.status === 200) {
            dispatch(fetchMe(Me?.jwt));
            setModalIsActive(!modalIsActive);
            setTimeout(() => {
              setModalValue(null);
              setModalDescription('');
              setModalTitle('');
              setModalValue2('');
              setHasValue2(false);
              setIsReadOnly(false);
              setInputMode('text');
              setApiCall(-1);
            }, 500);

            setLoading(false);
          } else {
            Alert.alert(
              t('profile:alertPhoneNumberTitle'),
              t('common:somethingWentWrong'),
              [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
            );
          }
        } else {
          Alert.alert(
            t('profile:alertPhoneNumberTitle'),
            t('common:phoneNumberAlreadyInUser'),
            [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
          );
        }
      }

      if (apiCall === 4) {
        if (
          Number(emergencyCountryCode + modalValue) === Number(Me.data.Phone)
        ) {
          Alert.alert(
            t('profile:alertemergencyPhoneNumberTitle'),
            t('common:emergencyPhoneNotSame'),
            [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
          );
          return;
        }
        const jordanianRegex = /^7[789]\d{7}$/;
        const qatariRegex = /^(3|4|5|6|7)\d{7}$/;

        if (modalValue === '') {
          Alert.alert(
            t('profile:alertemergencyPhoneNumberTitle'),
            t('common:enterPhoneNumber'),
            [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
          );
          return;
        }

        if (modalValue.length < 9) {
          if (emergencyCountryCode === 962) {
            Alert.alert(
              t('profile:alertemergencyPhoneNumberTitle'),
              `${t('common:emergencyPhoneNumberTitle')} ${
                emergencyCountryCode + modalValue
              } ${t('common:phoneNumberShort')}`,
              [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
            );
            return;
          }

          if (emergencyCountryCode === 974 && modalValue.length < 8) {
            Alert.alert(
              t('profile:alertemergencyPhoneNumberTitle'),
              `${t('common:emergencyPhoneNumberTitle')} ${
                emergencyCountryCode + modalValue
              } ${t('common:phoneNumberShort')}`,
              [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
            );
            return;
          }
        }

        if (modalValue.length > 9) {
          Alert.alert(
            t('profile:alertemergencyPhoneNumberTitle'),
            `${t('common:emergencyPhoneNumberTitle')} ${
              emergencyCountryCode + modalValue
            } ${t('common:phoneNumberLong')}`,
            [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
          );
          return;
        }

        if (emergencyCountryCode === 962) {
          if (!jordanianRegex.test(modalValue)) {
            Alert.alert(
              t('profile:alertemergencyPhoneNumberTitle'),
              `${t('common:emergencyPhoneNumberTitle')} ${
                emergencyCountryCode + modalValue
              } ${t('common:phoneNumberNotJordanian')}`,
              [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
            );
            return;
          }
        }

        if (emergencyCountryCode === 974) {
          if (!qatariRegex.test(modalValue)) {
            Alert.alert(
              t('profile:alertemergencyPhoneNumberTitle'),
              `${t('common:emergencyPhoneNumberTitle')} ${
                emergencyCountryCode + modalValue
              } ${t('common:phoneNumberNotQatari')}`,
              [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
            );
            return;
          }
        }
        const updateRes = await UpdateEmergencyPhone(
          Me.data.id,
          Me?.jwt,
          Number(emergencyCountryCode + modalValue),
        );
        if (updateRes.status === 200) {
          dispatch(fetchMe(Me?.jwt));
          setModalIsActive(!modalIsActive);
          setTimeout(() => {
            setModalValue(null);
            setModalDescription('');
            setModalTitle('');
            setModalValue2('');
            setHasValue2(false);
            setIsReadOnly(false);
            setInputMode('text');
            setApiCall(-1);
          }, 500);

          setLoading(false);
        } else {
          Alert.alert(
            t('profile:alertemergencyPhoneNumberTitle'),
            t('common:somethingWentWrong'),
            [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
          );
        }
      }

      if (apiCall === 5) {
        const updateRes = await UpdateDOB(
          Me.data.id,
          Me?.jwt,
          moment(modalValue).locale('en-gb').format('YYYY-MM-DD'),
        );
        if (updateRes.status === 200) {
          dispatch(fetchMe(Me?.jwt));
          setModalIsActive(!modalIsActive);
          setTimeout(() => {
            setModalValue(null);
            setModalDescription('');
            setModalTitle('');
            setModalValue2('');
            setHasValue2(false);
            setIsReadOnly(false);
            setInputMode('text');
            setApiCall(-1);
          }, 500);

          setLoading(false);
        } else {
          Alert.alert(
            t('profile:alertDobTitle'),
            t('common:somethingWentWrong'),
            [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
          );
        }
      }

      if (apiCall === 6) {
        const updateRes = await UpdateGender(
          Me.data.id,
          Me?.jwt,
          String(modalValue),
        );
        if (updateRes.status === 200) {
          dispatch(fetchMe(Me?.jwt));
          setModalIsActive(!modalIsActive);
          setTimeout(() => {
            setModalValue(null);
            setModalDescription('');
            setModalTitle('');
            setModalValue2('');
            setHasValue2(false);
            setIsReadOnly(false);
            setInputMode('text');
            setApiCall(-1);
            setIsGenderSelect(false);
            setModalOptions([]);
          }, 500);
          setLoading(false);
        } else {
          Alert.alert(
            t('profile:alertGenderTitle'),
            t('common:somethingWentWrong'),
            [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
          );
        }
      }

      if (apiCall === 7) {
        const updateRes = await UpdatePreferredPosition(
          Me.data.id,
          Me?.jwt,
          String(modalValue),
        );
        if (updateRes.status === 200) {
          dispatch(fetchMe(Me?.jwt));
          setModalIsActive(!modalIsActive);
          setTimeout(() => {
            setModalValue(null);
            setModalDescription('');
            setModalTitle('');
            setModalValue2('');
            setHasValue2(false);
            setIsReadOnly(false);
            setInputMode('text');
            setApiCall(-1);
            setIsGenderSelect(false);
            setIsPositionSelect(false);
            setModalOptions([]);
          }, 500);
          setLoading(false);
        } else {
          Alert.alert(
            t('profile:alertpreferedPosTitle'),
            t('common:somethingWentWrong'),
            [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
          );
        }
      }
    }
  };

  const uploadImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    })
      .then(async image => {
        // console.log('image', image);
        try {
          setUploadLoading(true);
          const gen_file = {
            name: `user-${Me.data.id}-${moment().format('YYYY-MM-DD')}.${
              image.mime
            }`,
            type: image.mime,
            uri: image.path,
          };
          const formData = new FormData();

          formData.append('files', gen_file, gen_file.name);

          await fetch(apiEndpoint + '/upload', {
            method: 'post',
            body: formData,
            headers: {Authorization: `Bearer ${Me?.jwt}`},
          })
            .then(response => response.json())
            .then(async data => {
              if (data?.length > 0) {
                const update_user = await UpdateProfilePicture(
                  Me.data.id,
                  Me?.jwt,
                  data[0].id,
                );
                if (update_user?.status === 200) {
                  const NewME = await FetchMe(Me?.jwt);
                  if (NewME?.data && NewME?.status === 200) {
                    dispatch(setUserImage(NewME.data.Image.url));
                    ImagePicker.clean()
                      .then(() => {
                        console.log(
                          'removed all tmp images from tmp directory',
                        );
                      })
                      .catch(e => {
                        console.log(e);
                      });
                  }
                  setUploadLoading(false);
                }
              }
            })
            .catch(error => {
              // Handle any errors
              console.error('Upload error:', error);
            });
        } catch (err) {
          console.log('err', err);
          setUploadLoading(false);
          throw err;
        }
      })
      .catch(callBack => {
        // you forgot to add catch to this promise.
        console.log(callBack);
        setUploadLoading(false);
      });
  };

  const changeCountryCodeHandler = value => {
    setCountryModalActive(!countryModalActive);
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

  //gender
  const [isGenderSelect, setIsGenderSelect] = useState(false);
  const [isPositionSelect, setIsPositionSelect] = useState(false);

  const changeGenderHandler = value => {
    setModalOptions([
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

    setModalValue(value.trim());
  };

  const changePositionHandler = value => {
    setModalOptions([
      {
        label: t('profile:preferedPosGK'),
        value: 'GK',
        isSelected: value === 'GK',
      },
      {
        label: t('profile:preferedPosDEF'),
        value: 'DEF',
        isSelected: value === 'DEF',
      },
      {
        label: t('profile:preferedPosMID'),
        value: 'MID',
        isSelected: value === 'MID',
      },
      {
        label: t('profile:preferedPosATT'),
        value: 'ATT',
        isSelected: value === 'ATT',
      },
    ]);

    setModalValue(value.trim());
  };

  const modalBody = (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
      <View>
        <CustomText
          style={[
            styles.fontSize.compact,
            styles.fontWeight.fw600,
            {marginBottom: METRICS.spaceSmall},
          ]}>
          {modalTitle ? modalTitle : 'Enter title'}
        </CustomText>
        <CustomText
          style={[styles.fontSize.small, {marginBottom: METRICS.spaceMedium}]}>
          {modalDescription ? modalDescription : 'Enter description'}
        </CustomText>
      </View>

      {isGenderSelect || isPositionSelect ? (
        <View style={styles.buttonRowFirst}>
          <RadioButtonGroup
            options={modalOptions}
            onChange={
              isGenderSelect
                ? changeGenderHandler
                : isPositionSelect
                ? changePositionHandler
                : null
            }
          />
        </View>
      ) : (
        <View style={[{width: '100%'}]}>
          {isReadOnly ? (
            <CustomText style={[styles.fontSize.medium]}>
              {modalValue}
            </CustomText>
          ) : [3, 4].includes(apiCall) ? (
            <View
              style={[
                styles.rowContainer,
                styles.alignCenter,
                {
                  flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
                },
                styles.countryCodeWrapper,
              ]}>
              <TouchableOpacity
                style={styles.countryCode}
                onPress={() => {
                  changeCountryCodeHandler(
                    apiCall === 3 ? phoneCountryCode : emergencyCountryCode,
                  );
                }}>
                <CustomText>{`${I18nManager.isRTL ? '' : '+'}${
                  apiCall === 3 ? phoneCountryCode : emergencyCountryCode
                }${I18nManager.isRTL ? '+' : ''}`}</CustomText>
              </TouchableOpacity>
              <Input
                style={styles.flex}
                hasCountryCode={true}
                placeholder={
                  apiCall === 3
                    ? t('common:phoneNumberPlaceholder')
                    : t('common:emergencyPhoneNumberPlaceholder')
                }
                inputMode="numeric"
                text={modalValue}
                onChange={onChangeHandler}
              />
            </View>
          ) : [5].includes(apiCall) ? (
            <View style={styles.rowContainer}>
              <LazyDatePicker
                date={modalValue ? new Date(modalValue) : new Date()}
                onDateChange={setModalValue}
                maximumDate={new Date()}
                androidVariant="iosClone"
                fadeToColor="none"
                mode="date"
                textColor="#fff"
                locale={currentLang}
              />
              {/* <View style={styles.flex}>
                <DateTimePicker
                  style={{width: '100%'}}
                  value={modalValue ? new Date(modalValue) : new Date()}
                  mode="date"
                  maximumDate={new Date()}
                  onChange={(e, curretDate) => {
                    setModalValue(curretDate);
                  }}
                  display="inline"
                  themeVariant="dark"
                  locale={currentLang}
                />
              </View> */}
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Input
                text={modalValue}
                inputMode={inputMode}
                placeholder={t('common:enterValue')}
                onChange={onChangeHandler}
              />
            </View>
          )}
        </View>
      )}

      {hasValue2 && (
        <View style={styles.buttonRow}>
          <Input
            text={modalValue2}
            inputMode={inputMode}
            placeholder={t('common:enterValue')}
            onChange={onChangeHandler2}
          />
        </View>
      )}

      {!isReadOnly && (
        <View style={styles.buttonRow}>
          <Button
            content={t('common:save')}
            disabled={loading}
            loading={loading}
            onPress={onSaveHandler}
            variant="solid"
            size="normal"
            fullWidth
          />
        </View>
      )}
    </View>
  );

  const countryModalBody = (
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
        <RadioButtonGroup
          options={modalOptions}
          onChange={countryCodeChangeHandler}
        />
      </View>
    </View>
  );

  const onPressBack = () => {
    navigation.goBack();
  };

  const [modalStyle, setModalStyle] = useState('halfWithEdge');

  const [playerStats, setPlayerStats] = useState({
    redCards: 0,
    yellowCards: 0,
    goals: 0,
    assists: 0,
    motm: 0,
  });
  const [fetchingStats, setFetchingStats] = useState(false);

  const fetchStatsHandler = async () => {
    setFetchingStats(true);
    try {
      const response = await FindMatchesStats(
        Me?.data?.id,
        countryCode,
        Me?.jwt,
      );
      setPlayerStats(response.data);
      setFetchingStats(false);
    } catch (e) {
      setFetchingStats(false);
    }
  };
  useEffect(() => {
    fetchStatsHandler();
  }, []);

  return (
    <HeroContainer
      title={t('profile:mainTitle')}
      onPressBack={onPressBack}
      modalIsActive={modalIsActive}
      setModalIsActive={() => {
        setModalIsActive(!modalIsActive);
        setTimeout(() => {
          setModalValue(null);
          setModalDescription('');
          setModalTitle('');
          setModalValue2('');
          setHasValue2(false);
          setIsReadOnly(false);
          setInputMode('text');
          setApiCall(-1);
          setModalStyle('halfWithEdge');
          setIsGenderSelect(false);
          setModalOptions([]);
        }, 500);
      }}
      modalStyle={modalStyle}
      modalBody={modalBody}
      nestedModalIsActive={countryModalActive}
      setNestedModalIsActive={() => setCountryModalActive(!countryModalActive)}
      nestedModalBody={countryModalBody}>
      {/* Profile Avatar */}
      <View
        style={[
          styles.container,
          styles.alignCenter,
          {
            marginBottom: METRICS.spaceLarge,
          },
        ]}>
        <TouchableOpacity
          style={[styles.alignEnd]}
          onPress={uploadImage}
          disabled={uploadLoading}>
          <Avatar
            img={Me.data?.Image ? rootURL + Me.data.Image.url : null}
            name={`${Me.data?.FirstName} ${Me.data?.LastName}`}
            size="Xlarge"
            loading={uploadLoading}
          />
          <View style={[styles.iconCircle, {position: 'absolute', bottom: 0}]}>
            <Icon name="camera" size={15} color={COLORS.white} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            {marginTop: METRICS.spaceMedium},
            styles.rowContainer,
            styles.alignCenter,
          ]}
          onPress={() => {
            setModalTitle(t('profile:nameTitle'));
            setModalDescription(t('profile:nameDesc'));
            setModalIsActive(true);
            setHasValue2(true);
            setModalValue(Me.data?.FirstName.trim());
            setModalValue2(Me.data?.LastName.trim());
            setInputMode('text');
            setApiCall(1);
            setModalStyle('');
          }}>
          <CustomText
            style={[
              styles.fontSize.compact,
              styles.fontWeight.fw600,
              {marginRight: METRICS.spaceTiny},
            ]}>
            {`${Me.data?.FirstName} ${Me.data?.LastName}`}
          </CustomText>
          <View style={[styles.iconCircle]}>
            <Icon name="pencil-solid" size={12} color={COLORS.white} />
          </View>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.container,
          {
            marginBottom: METRICS.spaceLarge,
          },
        ]}>
        <CustomText style={[styles.fontSize.small, styles.fontWeight.fw600]}>
          {t('profile:statsLabel')}
        </CustomText>
        <PlayerStats
          redCards={playerStats.redCards}
          yellowCards={playerStats.yellowCards}
          assists={playerStats.assists}
          goals={playerStats.goals}
          motm={playerStats.motm}
          loading={fetchingStats}
        />
      </View>

      <View
        style={[
          styles.container,
          {
            marginBottom: METRICS.spaceLarge,
            alignItems: 'flex-start',
          },
        ]}>
        <CustomText style={[styles.fontSize.small, styles.fontWeight.fw600]}>
          {t('profile:paymentLabel')}
        </CustomText>
        <Button
          content={t('profile:wallet')}
          iconLeft={<Icon name="wallet" size={20} color={COLORS.white} />}
          onPress={() => {
            navigation.navigate('WalletScreen');
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        />
      </View>

      <View
        style={[
          styles.container,
          {
            marginBottom: METRICS.spaceLarge,
            alignItems: 'flex-start',
          },
        ]}>
        <CustomText style={[styles.fontSize.small, styles.fontWeight.fw600]}>
          {t('profile:bookingsLabel')}
        </CustomText>
        <Button
          content={t('profile:matchesBookings')}
          iconLeft={<Icon name="football" size={20} color={COLORS.white} />}
          onPress={() => {
            navigation.navigate('ProfileStack', {
              screen: 'BookingsScreen',
              params: {matchType: 'match'},
            });
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        />
        <Button
          content={t('profile:tournamentsBookings')}
          iconLeft={<Icon name="trophy" size={20} color={COLORS.white} />}
          onPress={() => {
            navigation.navigate('ProfileStack', {
              screen: 'BookingsScreen',
              params: {matchType: 'tournaments'},
            });
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        />
      </View>

      <View
        style={[
          styles.container,
          {
            marginBottom: METRICS.spaceLarge,
            alignItems: 'flex-start',
          },
        ]}>
        <CustomText style={[styles.fontSize.small, styles.fontWeight.fw600]}>
          {t('profile:detailsLabel')}
        </CustomText>

        <Button
          content={Me.data.email}
          iconLeft={<Icon name="at" size={20} color={COLORS.white} />}
          onPress={() => {
            setModalTitle(t('profile:emailTitle'));
            setModalDescription(t('profile:emailDesc'));
            setModalIsActive(true);
            setModalValue(Me.data.email.trim());
            setIsReadOnly(true);
            setModalStyle('halfWithEdge');
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        />
        <Button
          content={Me.data.username}
          iconLeft={<Icon name="user" size={20} color={COLORS.white} />}
          onPress={() => {
            setModalTitle(t('profile:usernameTitle'));
            setModalDescription(t('profile:usernameDesc'));
            setModalIsActive(true);
            setModalValue(Me.data.username.trim());
            setInputMode('text');
            setApiCall(2);
            setModalStyle('');
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        />
        <Button
          content={Me.data.Phone}
          iconLeft={<Icon name="call" size={20} color={COLORS.white} />}
          onPress={() => {
            setModalTitle(t('common:phoneNumberTitle'));
            setModalDescription(t('profile:phoneNumberDesc'));
            setModalIsActive(true);
            setModalValue(removePrefix(Me.data.Phone).trim());
            setInputMode('numeric');
            setApiCall(3);
            setModalStyle('');
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        />

        <Button
          content={Me.data.EmergencyPhone}
          iconLeft={<Icon name="call" size={20} color={COLORS.white} />}
          onPress={() => {
            setModalTitle(t('common:emergencyPhoneNumberTitle'));
            setModalDescription(t('profile:emergencyPhoneNumberDesc'));
            setModalIsActive(true);
            setModalValue(removePrefix(Me.data.EmergencyPhone).trim());
            setInputMode('numeric');
            setApiCall(4);
            setModalStyle('');
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        />

        <Button
          content={`${t('profile:dobTitle')}: ${
            Me.data.dob ? Me.data.dob : t('common:notSet')
          }`}
          iconLeft={<Icon name="calendar" size={20} color={COLORS.white} />}
          onPress={() => {
            setModalTitle(t('profile:dobTitle'));
            setModalDescription(t('profile:dobDesc'));
            setModalIsActive(true);
            setModalValue(new Date(Me.data.dob));
            setInputMode('numeric');
            setApiCall(5);
            setModalStyle('fullWithEdge');
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        />

        <Button
          content={`${t('profile:genderTitle')}: ${t(
            `common:gender${Me.data.Gender}`,
          )}`}
          iconLeft={<Icon name="gender" size={20} color={COLORS.white} />}
          onPress={() => {
            setModalTitle(t('profile:genderTitle'));
            setModalDescription(t('common:selectGenderLabel'));
            setModalIsActive(true);
            setIsGenderSelect(true);
            setModalOptions([
              {
                label: t('common:genderMale'),
                value: 'Male',
                isSelected: Me.data.Gender === 'Male',
              },
              {
                label: t('common:genderFemale'),
                value: 'Female',
                isSelected: Me.data.Gender === 'Female',
              },
            ]);
            setApiCall(6);
            setModalStyle('fullWithEdge');
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        />

        <Button
          content={`${t('profile:preferedPosTitle')}: ${
            Me.data.PreferredPosition
              ? t(`profile:preferedPos${Me.data.PreferredPosition}`)
              : t('common:notSet')
          }`}
          iconLeft={<Icon name="formation" size={20} color={COLORS.white} />}
          onPress={() => {
            setModalTitle(t('profile:preferedPosTitle'));
            setModalDescription(t('profile:preferedPosDesc'));
            setModalIsActive(true);
            setIsPositionSelect(true);
            setModalOptions([
              {
                label: t('profile:preferedPosGK'),
                value: 'GK',
                isSelected: Me.data.PreferredPosition === 'GK',
              },
              {
                label: t('profile:preferedPosDEF'),
                value: 'DEF',
                isSelected: Me.data.PreferredPosition === 'DEF',
              },
              {
                label: t('profile:preferedPosMID'),
                value: 'MID',
                isSelected: Me.data.PreferredPosition === 'MID',
              },
              {
                label: t('profile:preferedPosATT'),
                value: 'ATT',
                isSelected: Me.data.PreferredPosition === 'ATT',
              },
            ]);
            setApiCall(7);
            setModalValue(Me.data.PreferredPosition);
            setModalStyle('fullWithEdge');
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        />
      </View>

      <View style={[styles.container, {marginBottom: METRICS.spaceXXLarge}]}>
        <Button
          content={t('profile:deleteAccountButton')}
          onPress={() => {
            Alert.alert(
              t('profile:deleteAccountButton'),
              t('profile:alertDeleteAccountDesc'),
              [
                {
                  text: t('profile:alertDeleteAccountConfirm'),
                  style: 'cancel',
                  onPress: async () => {
                    const res = await DeleteUser(Me.data.id, Me?.jwt);
                    if (res.status === 200) {
                      dispatch(logout());
                      await removeData('authUserJWT');

                      RNRestart.restart();
                    }
                  },
                },
                {
                  text: t('common:cancel'),
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
              ],
            );
          }}
          variant="cancelText"
          size="normal"
          fullWidth
        />
      </View>
    </HeroContainer>
  );
}

export default ProfileScreen;
