import React from 'react';
import {
  TouchableOpacity,
  View,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import {styles} from '@styles';

import {METRICS} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import CustomText from '@components/custom/custom_text';
import moment from 'moment';
import Avatar from '@components/atoms/avatar';
import OpenSpot from '@components/atoms/open_spot';
import Icon from '@components/atoms/icon';

import {useSelector} from 'react-redux';
import {getCurrency, getTimezone} from '@stores/selectors';

import {rootURL} from '@config/functions';
import CustomImage from '@components/custom/custom_image';

function PickupThumbnail(props) {
  const {item} = props;
  const pickupData = item.item.attributes;

  const TeamsAsArray = [
    pickupData.TeamA,
    pickupData.TeamB,
    pickupData.TeamC,
    pickupData.TeamD,
  ];

  const currency = useSelector(getCurrency);
  const currentTimezone = useSelector(getTimezone);

  let styleArr = [styles.matchThumbnail];
  if (props.style) {
    if (Array.isArray(props.style)) {
      styleArr = [...styleArr, ...props.style];
    } else {
      styleArr = [...styleArr, props.style];
    }
  }

  var backgroundImage = pickupData?.Image?.data
    ? {
        uri: rootURL + pickupData?.Image?.data?.attributes.formats?.small?.url,
      }
    : pickupData.Location?.data?.attributes?.Image?.data
    ? {
        uri:
          rootURL +
          pickupData.Location?.data?.attributes?.Image?.data?.attributes.formats
            ?.small?.url,
      }
    : require('@assets/images/FootballField1.png');

  return (
    <TouchableOpacity
      style={{width: 160}}
      onPress={props.onPress}
      disabled={props.loading}>
      <CustomImage
        source={backgroundImage}
        resizeMode="cover"
        isBackground={true}>
        <View
          style={[
            styles.rowContainer,
            styles.justifyBetween,
            {marginTop: METRICS.spaceSmall},
          ]}>
          <View style={[styles.tag, styles.tag.loc.left, styles.rowContainer]}>
            <CustomText style={[styles.tag.text]}>
              {`${TeamsAsArray.filter(team => team[0]).length}/4 `}
            </CustomText>
            <Icon
              name="users-alt"
              size={METRICS.sizeSmall}
              color={COLORS.white}
            />
          </View>
          <View style={[styles.tag, styles.tag.loc.right]}>
            <CustomText style={styles.tag.text}>
              {pickupData.Price + ' ' + currency}
            </CustomText>
          </View>
        </View>
        <View style={[{marginBottom: METRICS.spaceSmall}]}>
          <View
            style={[
              styles.rowContainer,
              styles.justifyCenter,
              styles.alignCenter,
            ]}>
            {TeamsAsArray.length > 0 && (
              <View style={[styles.rowContainer]}>
                {TeamsAsArray.map((el, index) => {
                  const teamEl = el[0];
                  if (teamEl) {
                    return (
                      <Avatar
                        key={index}
                        img={
                          teamEl?.Player?.data?.attributes?.Image?.data
                            ? `${rootURL}${teamEl.Player.data.attributes.Image.data.attributes.url}`
                            : null
                        }
                        name={
                          teamEl?.Player?.data?.attributes?.FirstName +
                          ' ' +
                          teamEl?.Player?.data?.attributes?.LastName
                        }
                        size="small"
                        isCaptain={teamEl.isCaptain}
                        isViceCaptain={teamEl.isViceCaptain}
                        style={
                          index > 0
                            ? {
                                marginLeft: -METRICS.spaceTiny,
                                zIndex: 3 - index,
                              }
                            : {marginLeft: METRICS.spaceTiny, zIndex: 3}
                        }
                      />
                    );
                  } else {
                    return (
                      <OpenSpot
                        key={index}
                        size="small"
                        style={
                          index > 0
                            ? {
                                marginLeft: -METRICS.spaceTiny,
                                zIndex: 3 - index,
                              }
                            : {marginLeft: METRICS.spaceTiny, zIndex: 3}
                        }
                      />
                    );
                  }
                })}
              </View>
            )}
          </View>
        </View>
        {props.loading && (
          <ActivityIndicator
            style={{position: 'absolute', top: 0, bottom: 0, right: 0, left: 0}}
            color={COLORS.white}
            size={40}
          />
        )}
      </CustomImage>
      <CustomText
        style={[
          styles.fontSize.normal,
          styles.fontWeight.fw600,
          {marginBottom: METRICS.spaceTiny},
        ]}>
        {`${pickupData.Name} ${
          moment(pickupData.StartDate).isSame(moment(), 'day')
            ? `Today - ${moment(pickupData.StartDate)
                .utcOffset(currentTimezone)
                .format('LT')} - ${moment(pickupData.EndDate)
                .utcOffset(currentTimezone)
                .format('LT')}`
            : `${moment(pickupData.StartDate)
                .utcOffset(currentTimezone)
                .format('YYYY-MM-DD LT')} - ${moment(pickupData.EndDate)
                .utcOffset(currentTimezone)
                .format('LT')}`
        }`}
      </CustomText>
      <CustomText
        style={[
          styles.fontSize.small,
          styles.fontWeight.fw400,
          styles.fontColor.grey,
        ]}>
        {pickupData.Location.data.attributes.Name}
      </CustomText>
    </TouchableOpacity>
  );
}

export default PickupThumbnail;
