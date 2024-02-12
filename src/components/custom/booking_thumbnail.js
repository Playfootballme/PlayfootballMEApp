import React from 'react';
import {TouchableOpacity, View, ImageBackground} from 'react-native';
import {styles} from '@styles';

import {METRICS} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import CustomText from '@components/custom/custom_text';
import moment from 'moment';
import Avatar from '@components/atoms/avatar';
import Icon from '@components/atoms/icon';

import {useSelector} from 'react-redux';
import {getCurrency, getMatches} from '@stores/selectors';
import {getLanguage, getTimezone} from '@stores/selectors';

function BookingThumbnail(props) {
  const {item} = props;
  const currentLang = useSelector(getLanguage);
  const currentTimezone = useSelector(getTimezone);

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={[styles.modalRow]}>
        <View
          style={[
            styles.rowContainer,
            styles.justifyBetween,
            styles.alignCenter,
            {marginBottom: METRICS.spaceXTiny},
          ]}>
          <View
            style={[styles.iconBackground, {marginRight: METRICS.spaceSmall}]}>
            <Icon name="football" size={30} color={COLORS.white} />
          </View>
          <View style={styles.flex}>
            <CustomText style={[styles.fontSize.normal]}>
              {currentLang === 'ar'
                ? item?.item?.attributes?.NameAR
                : item?.item?.attributes?.Name}
            </CustomText>
            <CustomText
              style={[
                styles.fontSize.small,
                {marginBottom: METRICS.spaceXTiny},
              ]}>
              {moment(item?.item?.attributes?.StartDate)
                .utcOffset(currentTimezone)
                .format('dddd DD/MM/YY LT') +
                ' - ' +
                moment(item?.item?.attributes?.EndDate)
                  .utcOffset(currentTimezone)
                  .format('LT')}
            </CustomText>
            <CustomText
              style={[
                styles.fontSize.small,
                {marginBottom: METRICS.spaceSmall},
              ]}>
              {currentLang === 'ar'
                ? item?.item?.attributes?.Location.data?.attributes.NameAR
                : item?.item?.attributes?.Location.data?.attributes.Name}
            </CustomText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default BookingThumbnail;
