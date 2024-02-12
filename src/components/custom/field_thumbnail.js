import React from 'react';
import {
  TouchableOpacity,
  View,
  ActivityIndicator,
  Dimensions,
  Linking,
} from 'react-native';
import {styles} from '@styles';

import {METRICS} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import CustomText from '@components/custom/custom_text';
import moment from 'moment';
import Avatar from '@components/atoms/avatar';
import Icon from '@components/atoms/icon';

import {useSelector} from 'react-redux';
import {getCurrency, getLanguage, getTimezone, getMe} from '@stores/selectors';

import {rootURL} from '@config/functions';
import CustomImage from '@components/custom/custom_image';
import Button from '@components/atoms/button';

import {t} from 'i18next';
function FieldThumbnail(props) {
  const {item} = props;
  const field_data = item.item.attributes;
  const currentLang = useSelector(getLanguage);

  var backgroundImage = field_data?.Image?.data
    ? {
        uri: rootURL + field_data?.Image?.data?.attributes.formats?.small?.url,
      }
    : require('@assets/images/FootballField1.png');

  const maxItemsToShow = 3;
  const facilitiesIcons = [];

  let additionalFacilitiesCount = 0;

  for (const key in field_data.Facilities) {
    if (field_data.Facilities[key] && key !== 'id') {
      if (facilitiesIcons.length < maxItemsToShow) {
        facilitiesIcons.push(
          <View style={[styles.card, {padding: 8, borderRadius: 5}]} key={key}>
            <View style={[styles.rowContainer, styles.alignCenter]}>
              <Icon name={key.toLowerCase()} size={16} color={COLORS.white} />
            </View>
          </View>,
        );
      } else {
        additionalFacilitiesCount++;
      }
    }
  }

  return (
    <TouchableOpacity
      style={[styles.card]}
      onPress={props.onPress}
      disabled={props.loading}>
      <View
        style={[
          styles.rowContainer,
          styles.alignCenter,
          styles.justifyBetween,
        ]}>
        <View style={[styles.rowContainer, {marginBottom: METRICS.spaceSmall}]}>
          <CustomText style={[styles.fontSize.normal, styles.fontWeight.fw600]}>
            {currentLang === 'ar'
              ? field_data?.NameAR
                ? field_data?.NameAR
                : field_data?.Name
              : field_data?.Name}
          </CustomText>
        </View>
        <TouchableOpacity
          style={[styles.card, {padding: 8, borderRadius: 5}]}
          onPress={() => Linking.openURL(field_data?.GoogleMapLink)}>
          <View style={[styles.rowContainer, styles.alignCenter]}>
            <Icon name={'map-marker'} size={16} color={COLORS.white} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={[styles.rowContainer]}>
        <View
          style={[styles.matchThumbnail80, {marginRight: METRICS.spaceTiny}]}>
          <CustomImage
            isBackground={true}
            source={backgroundImage}
            resizeMode="cover"
            isFullWidth={props.fullWidth}>
            {props.loading && (
              <ActivityIndicator
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  left: 0,
                }}
                color={COLORS.white}
                size={40}
              />
            )}
          </CustomImage>
        </View>
        <View style={styles.flex}>
          <CustomText
            style={[
              styles.fontSize.small,
              styles.fontWeight.fw400,
              styles.fontColor.grey,
              {marginBottom: METRICS.spaceTiny},
            ]}>
            {t(`matches:${field_data?.Type?.toLowerCase()}`)}
          </CustomText>
          <View
            style={[
              styles.rowContainer,
              styles.alignCenter,
              styles.justifyBetween,
            ]}>
            <CustomText
              style={[styles.fontSize.small, styles.fontWeight.fw600]}>
              {field_data?.City}
            </CustomText>

            <View style={[styles.rowContainer, styles.justifyEnd, {gap: 5}]}>
              {facilitiesIcons}
              {additionalFacilitiesCount > 0 && (
                <View style={[styles.card, {padding: 8, borderRadius: 5}]}>
                  <CustomText>+{additionalFacilitiesCount}</CustomText>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default FieldThumbnail;
