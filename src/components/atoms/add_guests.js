import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  I18nManager,
} from 'react-native';
import {styles} from '@styles';
import CustomText from '@components/custom/custom_text';
import {METRICS} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import Icon from '@components/atoms/icon';
import Input from '@components/atoms/input';
import Avatar from '@components/atoms/avatar';

import {emailRegex, FindUserByEmail, rootURL} from '@config/functions';

import {useSelector} from 'react-redux';

import {getMe} from '@stores/selectors';
import {t} from 'i18next';

function AddGuests(props) {
  const Me = useSelector(getMe);

  const [loading, setLoading] = useState(false);

  const [emailValue, setEmailValue] = useState('');

  const onChangeEmailHandler = text => {
    setEmailValue(text);
  };

  const CheckGuest = async () => {
    // setLoading(true);
    if (emailValue.length === 0) {
      Alert.alert(t('matches:addGuestsLabel'), t('common:enterYourEmail'), [
        {text: t('common:tryAgain'), onPress: () => setLoading(false)},
      ]);
      return;
    }

    if (!emailRegex.test(emailValue)) {
      Alert.alert(t('matches:addGuestsLabel'), t('common:enterValidEmail'), [
        {text: t('common:tryAgain'), onPress: () => setLoading(false)},
      ]);
      return;
    }

    const response = await FindUserByEmail(emailValue);

    if (response.data.length === 0 || response.data[0].confirmed === false) {
      Alert.alert(
        t('matches:addGuestsLabel'),
        t('common:userNotFoundByEmail'),
        [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
      );
      return;
    }

    if (response.data[0].id === Me?.data?.id) {
      Alert.alert(t('matches:addGuestsLabel'), t('common:youCantAddYourself'), [
        {text: t('common:tryAgain'), onPress: () => setLoading(false)},
      ]);
      return;
    }

    if (props.match?.Location.Country !== response.data[0].currentCountry) {
      Alert.alert(
        t('matches:addGuestsLabel'),
        t('common:youCantAddUserAnotherCountry'),
        [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
      );
      return;
    }

    let isGenderValid = true;
    if (props.match?.Gender !== 'Mix') {
      if (props.match?.Gender !== response.data[0].Gender) {
        isGenderValid = false;
      }
    }

    if (response.data.length > 0) {
      const newGuest = response.data[0];
      const isGuestAlreadySelected = props.selectedGuests.some(
        guest => guest.id === newGuest.id,
      );

      const newGuestObj = {
        id: newGuest.id,
        email: newGuest.email,
        Image: newGuest.Image,
        FirstName: newGuest.FirstName,
        LastName: newGuest.LastName,
        Gender: newGuest.Gender,
        selected:
          props.selectedGuests.filter(
            selected_guests => selected_guests.selected === true,
          ).length === 2
            ? false
            : isGenderValid,
        loading: false,
        joined: false,
      };

      if (!isGuestAlreadySelected) {
        props.selectGuests([...props.selectedGuests, newGuestObj]);
      } else {
        Alert.alert(
          t('matches:addGuestsLabel'),
          `${t('common:userInListPt1')} ${newGuestObj.email} ${t(
            'common:userInListPt2',
          )}`,
          [{text: t('common:tryAgain'), onPress: () => setLoading(false)}],
        );
      }
      setLoading(false);
      setEmailValue(null);
    }
  };
  return (
    <View style={styles.flex}>
      <View
        style={[
          styles.rowContainer,
          styles.alignCenter,
          styles.justifyBetween,
          {marginBottom: METRICS.spaceSmall},
        ]}>
        <Input
          placeholder={t('common:emailPlaceholder')}
          text={emailValue}
          inputMode="email"
          variant="email"
          onChange={onChangeEmailHandler}
        />
        <TouchableOpacity
          disabled={loading}
          style={[
            styles.alignCenters,
            {
              [`margin${I18nManager.isRTL ? 'Left' : 'Right'}`]:
                METRICS.spaceTiny,
              position: 'absolute',
              [`${I18nManager.isRTL ? 'left' : 'right'}`]: 0,
            },
          ]}
          onPress={CheckGuest}>
          <View style={[styles.iconCircle, styles.iconBackgroundAbsent]}>
            <Icon name="search" size={18} color={COLORS.white} />
          </View>
        </TouchableOpacity>
      </View>

      {props.selectedGuests.length > 0 && (
        <ScrollView>
          {props.selectedGuests.map((this_guest, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.rowContainer,
                  styles.alignCenter,
                  {marginBottom: METRICS.spaceSmall},
                ]}
                onPress={() => {
                  if (
                    this_guest.selected === false &&
                    props.selectedGuests.filter(
                      selected_guests => selected_guests.selected === true,
                    ).length === 2
                  ) {
                    Alert.alert(
                      t('matches:addGuestsLabel'),
                      t('matches:alertSelectGuests'),
                      [
                        {
                          text: t('common:tryAgain'),
                          onPress: () => console.log('Press'),
                        },
                      ],
                    );
                    return;
                  }

                  if (props.match?.Gender !== 'Mix') {
                    if (props.match?.Gender !== this_guest.Gender) {
                      Alert.alert(
                        t('matches:addGuestsLabel'),
                        t('common:alertGenderMismatch'),
                        [
                          {
                            text: t('common:tryAgain'),
                            onPress: () => console.log('Press'),
                          },
                        ],
                      );
                      return;
                    }
                  }
                  const updatedGuests = props.selectedGuests.map(guest =>
                    guest.id === this_guest.id
                      ? {...guest, selected: !guest.selected}
                      : guest,
                  );

                  props.selectGuests(updatedGuests);
                }}>
                <Avatar
                  img={
                    this_guest?.Image
                      ? `${rootURL}${this_guest?.Image?.url}`
                      : null
                  }
                  name={this_guest?.FirstName + ' ' + this_guest?.LastName}
                  size={'small'}
                />
                <View style={[styles.flex, {marginLeft: METRICS.spaceTiny}]}>
                  <CustomText style={[styles.fontSize.small]}>
                    {this_guest?.FirstName + ' ' + this_guest?.LastName}
                  </CustomText>

                  <CustomText
                    style={[
                      styles.fontSize.tiny,
                      styles.fontWeight.fw400,
                      styles.fontColor.grey,
                    ]}>
                    {this_guest?.email}
                  </CustomText>
                </View>
                <View
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor: this_guest?.selected
                        ? COLORS.blue
                        : 'transparent',
                      width: 20,
                      height: 20,
                      borderWidth: 1,
                      borderColor: this_guest?.selected
                        ? COLORS.blue
                        : COLORS.white,
                      marginRight: METRICS.spaceTiny,
                    },
                  ]}>
                  {this_guest?.selected && (
                    <Icon name="checkmark" size={12} color={COLORS.white} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

export default AddGuests;
