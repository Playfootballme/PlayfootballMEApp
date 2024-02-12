import React from 'react';
import {useNavigation} from '@react-navigation/native';

import HeroContainer from '@containers/hero_container';

import {styles} from '@styles';
import {View, Alert} from 'react-native';
import CustomText from '@components/custom/custom_text';
import {METRICS} from '@theme/metrics';
import Button from '@components/atoms/button';

import {UsernameAvailability} from '@config/functions';
import Input from '@components/atoms/input';
import {useDispatch} from 'react-redux';
import {updateUsername} from '@stores/slices/registrationSteps';
import {useStateIfMounted} from 'use-state-if-mounted';
import {t} from 'i18next';

function SignUpUsernameScreen(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [username, setUsername] = useStateIfMounted('');
  const onPressBack = () => {
    navigation.goBack();
  };

  const onChangeUserName = text => {
    setUsername(text);
  };

  const RegisterUsernameHandler = async () => {
    if (username.length === 0) {
      Alert.alert(t('signUp:signUpButton'), t('common:usernameEmpty'), [
        {
          text: t('common:tryAgain'),
          onPress: () => console.log(t('common:tryAgain')),
        },
      ]);
      return;
    }

    const noSpacesRegex = /^\S+$/;
    if (!noSpacesRegex.test(username)) {
      Alert.alert(t('signUp:signUpButton'), t('common:usernameNoSpaces'), [
        {
          text: t('common:tryAgain'),
          onPress: () => console.log(t('common:tryAgain')),
        },
      ]);
      return;
    }

    const usernameAvailability = await UsernameAvailability(
      username.toLowerCase().trim(),
    );
    if (usernameAvailability.data.length === 0) {
      dispatch(updateUsername(username.toLowerCase().trim()));
      navigation.navigate('SignUpNameScreen');
    } else {
      Alert.alert(t('signUp:signUpButton'), t('common:usernameAlreadyInUse'), [
        {
          text: t('common:tryAgain'),
          onPress: () => console.log(t('common:tryAgain')),
        },
      ]);
    }
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
          onPress={RegisterUsernameHandler}
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
            {t('signUp:newUsernameTitle')}
          </CustomText>

          <CustomText style={[styles.fontSize.normal, styles.fontWeight.fw300]}>
            {t('signUp:newUsernameDesc')}
          </CustomText>
        </View>

        <View style={{marginTop: METRICS.spaceXXLarge}}>
          <View style={[{marginBottom: METRICS.spaceCompact}]}>
            <Input
              placeholder={t('signUp:usernamePlaceholder')}
              inputMode="text"
              text={username}
              onChange={onChangeUserName}
            />
          </View>
        </View>
      </View>
    </HeroContainer>
  );
}

export default SignUpUsernameScreen;
