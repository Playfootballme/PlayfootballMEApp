import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  FlatList,
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

function TransferCredit(props) {
  const Me = useSelector(getMe);

  const [loading, setLoading] = useState(false);

  const [emailValue, setEmailValue] = useState('');

  const onChangeEmailHandler = text => {
    setEmailValue(text);
  };

  const CheckGuest = async () => {
    // setLoading(true);
    if (emailValue.length === 0) {
      Alert.alert(t('wallet:addRecipient'), t('common:enterYourEmail'), [
        {text: t('common:tryAgain'), onPress: () => setLoading(false)},
      ]);
      return;
    }

    if (!emailRegex.test(emailValue)) {
      Alert.alert(t('wallet:addRecipient'), t('common:enterValidEmail'), [
        {text: t('common:tryAgain'), onPress: () => setLoading(false)},
      ]);
      return;
    }

    const response = await FindUserByEmail(emailValue);

    if (response.data.length === 0 || response.data[0].confirmed === false) {
      Alert.alert(t('wallet:addRecipient'), t('common:userNotFoundByEmail'), [
        {text: t('common:tryAgain'), onPress: () => setLoading(false)},
      ]);
      return;
    }

    if (response.data[0].id === Me?.data?.id) {
      Alert.alert(t('wallet:addRecipient'), t('common:youCantAddYourself'), [
        {text: t('common:tryAgain'), onPress: () => setLoading(false)},
      ]);
      return;
    }

    if (response.data.length > 0) {
      const newGuest = response.data[0];
      const isGuestAlreadySelected = props.selectedRecipients.some(
        guest => guest.id === newGuest.id,
      );

      const newGuestObj = {
        id: newGuest.id,
        email: newGuest.email,
        Image: newGuest.Image,
        FirstName: newGuest.FirstName,
        LastName: newGuest.LastName,
      };

      if (!isGuestAlreadySelected) {
        props.foundHandler([...props.selectedRecipients, newGuestObj]);
      } else {
        Alert.alert(
          t('wallet:addRecipient'),
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
    <View style={[styles.flex]}>
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

      {props.recentTransfers.length > 0 && (
        <View>
          <CustomText style={[{marginBottom: METRICS.spaceTiny}]}>
            {t('wallet:recentTransfers')}
          </CustomText>
          <FlatList
            horizontal
            data={props.recentTransfers}
            renderItem={this_item => {
              const item = this_item.item;
              return (
                <TouchableOpacity
                  style={[
                    styles.rowContainer,
                    styles.alignCenter,
                    {marginRight: METRICS.spaceSmall},
                  ]}
                  onPress={() => {
                    props.pressHandler(item.id);
                  }}>
                  <Avatar
                    img={
                      item?.Image
                        ? `${rootURL}${item?.Image?.attributes?.url}`
                        : null
                    }
                    name={item?.FirstName + ' ' + item?.LastName}
                    size={'small'}
                  />
                  <View style={[styles.flex, {marginLeft: METRICS.spaceTiny}]}>
                    <CustomText style={[styles.fontSize.small]}>
                      {item?.FirstName + ' ' + item?.LastName}
                    </CustomText>

                    <CustomText
                      style={[
                        styles.fontSize.tiny,
                        styles.fontWeight.fw400,
                        styles.fontColor.grey,
                      ]}>
                      {item?.email}
                    </CustomText>
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={item => item.id}
          />
        </View>
      )}

      {props.selectedRecipients.length > 0 && (
        <ScrollView>
          <CustomText
            style={[
              {marginTop: METRICS.spaceSmall, marginBottom: METRICS.spaceTiny},
            ]}>
            {`${t('wallet:transferButton')} ${t(
              'wallet:transferConfirmationDescPt2',
            )}`}
          </CustomText>
          {props.selectedRecipients.map((this_recipient, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.rowContainer,
                  styles.alignCenter,
                  {marginBottom: METRICS.spaceSmall},
                ]}
                onPress={() => {
                  props.pressHandler(this_recipient.id);
                }}>
                <Avatar
                  img={
                    this_recipient?.Image
                      ? `${rootURL}${this_recipient?.Image?.url}`
                      : null
                  }
                  name={
                    this_recipient?.FirstName + ' ' + this_recipient?.LastName
                  }
                  size={'small'}
                />
                <View style={[styles.flex, {marginLeft: METRICS.spaceTiny}]}>
                  <CustomText style={[styles.fontSize.small]}>
                    {this_recipient?.FirstName + ' ' + this_recipient?.LastName}
                  </CustomText>

                  <CustomText
                    style={[
                      styles.fontSize.tiny,
                      styles.fontWeight.fw400,
                      styles.fontColor.grey,
                    ]}>
                    {this_recipient?.email}
                  </CustomText>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

export default TransferCredit;
