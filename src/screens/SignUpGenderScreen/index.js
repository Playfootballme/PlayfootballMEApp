import React from 'react';
import {useNavigation, CommonActions} from '@react-navigation/native';

import HeroContainer from '@containers/hero_container';

import {styles} from '@styles';
import {Alert, View} from 'react-native';
import CustomText from '@components/custom/custom_text';
import {METRICS} from '@theme/metrics';
import Button from '@components/atoms/button';
import RadioButtonGroup from '@components/atoms/radio_button_group';
import {updateGender} from '@stores/slices/registrationSteps';
import {useDispatch, useSelector} from 'react-redux';
import {
  UpdateUser,
  storeData,
  getData,
  ConfirmUser,
  LoginUser,
} from '@config/functions';
import {fetchMe} from '@stores/services';

import {setJWT} from '@stores/slices/authUser';
import {useStateIfMounted} from 'use-state-if-mounted';
import {t} from 'i18next';
import moment from 'moment';

function SignUpGenderScreen(props) {
  const navigation = useNavigation();
  const registrationSteps = useSelector(state => state.registrationSteps);
  const dispatch = useDispatch();
  const [selectedGender, setSelectedGender] = useStateIfMounted('Male');

  const genderOptions = [
    {
      label: t('common:genderMale'),
      value: 'Male',
      isSelected: selectedGender === 'Male',
    },
    {
      label: t('common:genderFemale'),
      value: 'Female',
      isSelected: selectedGender === 'Female',
    },
  ];

  const onPressBack = () => {
    navigation.goBack();
  };

  const onChangeGenderHandler = value => {
    setSelectedGender(value);
  };

  const RegisterGenderHandler = async () => {
    dispatch(updateGender(selectedGender));

    const confirmRes = await ConfirmUser(
      registrationSteps.id,
      registrationSteps.email,
    );
    if (confirmRes.status === 200) {
      const loginRes = await LoginUser(registrationSteps.email, '12345678'); //temp

      if (loginRes.status === 200) {
        await storeData('tempJWT', JSON.stringify(loginRes.data.jwt));

        let updatedUser = await UpdateUser(
          registrationSteps.id,
          loginRes.data.jwt,
          registrationSteps.email,
          registrationSteps.username,
          registrationSteps.password,
          registrationSteps.FirstName,
          registrationSteps.LastName,
          Number(registrationSteps.Phone),
          Number(registrationSteps.EmergencyPhone),
          registrationSteps.DOB,
          registrationSteps.PrefPos,
          selectedGender,
        );

        if (updatedUser.status === 200) {
          const tempJWT = await getData('tempJWT');
          if (tempJWT || registrationSteps.jwt) {
            await storeData(
              'authUserJWT',
              JSON.stringify(tempJWT || registrationSteps.jwt),
            );
            dispatch(setJWT(tempJWT || registrationSteps.jwt));
            dispatch(fetchMe(tempJWT || registrationSteps.jwt));

            navigation.replace('TabsStack', {
              screen: 'HomeScreen',
            });
          }
        } else {
          Alert.alert(
            t('signUp:signUpButton'),
            t('common:somethingWentWrong'),
            [
              {
                text: t('common:tryAgain'),
                onPress: () => console.log('OK Pressed'),
                style: 'cancel',
              },
            ],
          );
        }
      }
    }
  };

  const bottomButton = (
    <View
      style={[styles.container, {position: 'absolute', bottom: 20, zIndex: 1}]}>
      <View style={[styles.buttonRow]}>
        <Button
          content={t('signUp:createAccountButton')}
          variant="solid"
          size="normal"
          fullWidth={true}
          onPress={RegisterGenderHandler}
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
            {t('common:selectGenderLabel')}
          </CustomText>
        </View>

        <View style={{marginTop: METRICS.spaceXXLarge}}>
          <View style={styles.buttonRowFirst}>
            <RadioButtonGroup
              options={genderOptions}
              onChange={onChangeGenderHandler}
            />
          </View>
        </View>
      </View>
    </HeroContainer>
  );
}

export default SignUpGenderScreen;
