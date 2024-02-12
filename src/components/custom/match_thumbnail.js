import React from 'react';
import {
  TouchableOpacity,
  View,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {styles} from '@styles';

import {METRICS} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import CustomText from '@components/custom/custom_text';
import moment from 'moment';
import Avatar from '@components/atoms/avatar';
import Icon from '@components/atoms/icon';

import {useSelector} from 'react-redux';
import {
  getCurrency,
  getLanguage,
  getTimezone,
  getMe,
  getCountry,
} from '@stores/selectors';

import {rootURL} from '@config/functions';
import CustomImage from '@components/custom/custom_image';
import Button from '@components/atoms/button';

import {t} from 'i18next';
function MatchThumbnail(props) {
  const {item} = props;
  const matchData = item.item;
  const currency = useSelector(getCurrency);
  const currentLang = useSelector(getLanguage);
  const currentTimezone = useSelector(getTimezone);
  const countryCode = useSelector(getCountry);

  const Me = useSelector(getMe);

  let styleArr = [styles.matchThumbnail];
  if (props.style) {
    if (Array.isArray(props.style)) {
      styleArr = [...styleArr, ...props.style];
    } else {
      styleArr = [...styleArr, props.style];
    }
  }

  var backgroundImage = matchData?.Image
    ? {
        uri: rootURL + matchData?.Image?.formats?.small?.url,
      }
    : matchData.Location?.Image
    ? {
        uri: rootURL + matchData.Location?.Image?.formats?.small?.url,
      }
    : require('@assets/images/FootballField1.png');

  const isFull = () => {
    return matchData.Players?.length >= matchData.Capacity;
  };

  const isPastEvent = () => {
    var todayDate = moment();
    var endTime = moment(matchData?.EndDate);
    return todayDate.isAfter(endTime);
  };

  const matchPlayers = matchData.Players?.map(p => p?.Player?.id);

  const isUserInMatch = matchPlayers?.includes(Me?.data?.id);

  const formatDate = (startDate, endDate) => {
    let isTodayOrTomorrow = '';

    if (moment(startDate).isSame(moment(), 'day')) {
      isTodayOrTomorrow = t('common:todayLabel');
    } else if (moment(startDate).isSame(moment().add(1, 'day'), 'day')) {
      isTodayOrTomorrow = t('common:tomorrowLabel');
    }

    if (props.fullwidth) {
      return `${moment(startDate)
        .utcOffset(currentTimezone)
        .format('LT')} - ${moment(endDate)
        .utcOffset(currentTimezone)
        .format('LT')}`;
    }
    if (isTodayOrTomorrow) {
      return `${isTodayOrTomorrow}, ${moment(startDate)
        .utcOffset(currentTimezone)
        .format('LT')} - ${moment(endDate)
        .utcOffset(currentTimezone)
        .format('LT')}`;
    } else {
      return `${moment(startDate)
        .utcOffset(currentTimezone)
        .format('YYYY-MM-DD LT')} - ${moment(endDate)
        .utcOffset(currentTimezone)
        .format('LT')}`;
    }
  };

  if (props.fullwidth) {
    return (
      <TouchableOpacity
        style={[styles.card]}
        onPress={props.onPress}
        disabled={props.loading}>
        <View style={[styles.rowContainer, styles.alignCenter]}>
          <View
            style={[styles.rowContainer, {marginBottom: METRICS.spaceSmall}]}>
            <CustomText
              style={[styles.fontSize.normal, styles.fontWeight.fw600]}>
              {currentLang === 'ar'
                ? matchData?.NameAR
                  ? matchData?.NameAR
                  : matchData?.Name
                : matchData?.Name + ' - '}
            </CustomText>
            <CustomText
              style={[styles.fontSize.normal, styles.fontWeight.fw600]}>
              {formatDate(matchData.StartDate, matchData.EndDate)}
            </CustomText>
          </View>

          <View style={[styles.flex, styles.alignEnd]}>
            <View style={styles.tagOutline}>
              <CustomText style={[styles.tag.text]}>
                {`${matchData.Players?.length}/${matchData.Capacity}`}
              </CustomText>
            </View>
          </View>
        </View>
        <View style={[styles.rowContainer]}>
          <View
            style={[styles.matchThumbnail80, {marginRight: METRICS.spaceTiny}]}>
            <CustomImage
              isBackground={true}
              source={backgroundImage}
              resizeMode="cover"
              isFullWidth={props.fullwidth}>
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
              {currentLang === 'ar'
                ? matchData.Location?.NameAR
                  ? matchData.Location?.NameAR
                  : matchData.Location?.Name
                : matchData.Location?.Name}
            </CustomText>
            <View
              style={[
                styles.rowContainer,
                styles.alignCenter,
                styles.justifyBetween,
              ]}>
              <View style={[styles.rowContainer, styles.alignEnd]}>
                <CustomText
                  style={[styles.fontSize.normal, styles.fontWeight.fw600]}>
                  {matchData.Price +
                    ' ' +
                    t(`common:${currency.toLowerCase()}`)}
                </CustomText>
                {countryCode === 'JO' && (
                  <CustomText
                    style={[
                      styles.fontWeight.fw400,
                      styles.fontColor.grey,
                      styles.fontSize.small,
                      {marginLeft: METRICS.spaceXTiny},
                    ]}>
                    {t('common:includingTaxLabel')}
                  </CustomText>
                )}
              </View>
              <Button
                disabled={isPastEvent()}
                content={
                  isPastEvent()
                    ? t('matches:eventEndedButton')
                    : isFull()
                    ? t('matches:joinWaitingListButton')
                    : t('matches:joinEventButton')
                }
                onPress={props.onPress}
                variant={isFull() ? 'waiting' : 'solid'}
                size="small"
                textStyle={styles.fontWeight.fw600}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={
        props.fullwidth
          ? [
              styles.rowContainer,
              styles.alignCenter,
              {width: Dimensions.get('window').width},
            ]
          : {width: 'auto'}
      }
      onPress={props.onPress}
      disabled={props.loading}>
      <View style={props.fullwidth && styles.matchThumbnail160}>
        <CustomImage
          isBackground={true}
          source={backgroundImage}
          resizeMode="cover"
          style={styleArr}>
          <View
            style={[
              styles.rowContainer,
              styles.justifyBetween,
              {marginTop: METRICS.spaceSmall},
            ]}>
            <View
              style={[
                styles.rowContainer,
                styles.alignCenter,
                styles.tag,
                styles.tag.loc.left,
              ]}>
              <CustomText style={[styles.tag.text]}>
                {`${matchData.Players?.length}/${matchData.Capacity}`}
              </CustomText>
              <Icon
                name="users-alt"
                size={METRICS.sizeSmall}
                color={COLORS.white}
              />
            </View>
            <View style={[styles.tag, styles.tag.loc.right]}>
              <CustomText style={styles.tag.text}>
                {matchData.Price + ' ' + t(`common:${currency.toLowerCase()}`)}
              </CustomText>
            </View>
          </View>
          <View
            style={[
              styles.rowContainer,
              styles.justifyCenter,
              styles.alignCenter,
              {marginBottom: METRICS.spaceSmall},
            ]}>
            <View>
              {matchData.Players?.length > 0 && (
                <View style={[styles.rowContainer]}>
                  {matchData.Players?.slice(0, 3).map((el, index) => {
                    return (
                      <Avatar
                        key={index}
                        img={
                          el?.Player?.Image
                            ? `${rootURL}${el?.Player?.Image?.url}`
                            : null
                        }
                        name={
                          el?.Player?.FirstName + ' ' + el?.Player?.LastName
                        }
                        size={'small'}
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
                  })}

                  {matchData.Players?.length > 3 && (
                    <Avatar
                      backgroundColor={COLORS.lightBlack}
                      name={`+ ${matchData.Players?.length - 3}`}
                      size={'small'}
                      style={{marginLeft: -METRICS.spaceTiny, zIndex: 0}}
                    />
                  )}
                </View>
              )}
            </View>
          </View>
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

      <View
        style={[
          props.fullwidth
            ? [
                {
                  marginHorizontal: METRICS.spaceSmall,
                  flexShrink: 1,
                },
              ]
            : [],
        ]}>
        {props.fullwidth ? (
          <View>
            <View style={[styles.flex]}>
              <CustomText
                style={[styles.fontSize.medium, styles.fontWeight.fw600]}>
                {currentLang === 'ar'
                  ? matchData?.NameAR
                    ? matchData?.NameAR
                    : matchData?.Name
                  : matchData?.Name}
              </CustomText>
            </View>
            <View
              style={[
                styles.rowContainer,
                {
                  flexWrap: 'wrap',
                },
              ]}>
              <CustomText
                style={[
                  styles.fontSize.normal,
                  styles.fontWeight.fw600,
                  {
                    marginBottom: METRICS.spaceTiny,
                    width: Dimensions.get('window').width / 2 - 20,
                  },
                ]}>
                {formatDate(matchData.StartDate, matchData.EndDate)}
              </CustomText>
            </View>
          </View>
        ) : (
          <CustomText
            style={[
              styles.fontSize.normal,
              styles.fontWeight.fw600,
              {marginBottom: METRICS.spaceTiny},
            ]}>
            {`${
              currentLang === 'ar' ? matchData?.NameAR : matchData?.Name
            } ${formatDate(matchData.StartDate, matchData.EndDate)}`}
          </CustomText>
        )}
        <CustomText
          style={[
            styles.fontSize.small,
            styles.fontWeight.fw400,
            styles.fontColor.grey,
            {marginBottom: METRICS.spaceTiny},
          ]}>
          {currentLang === 'ar'
            ? matchData.Location?.NameAR
              ? matchData.Location?.NameAR
              : matchData.Location?.Name
            : matchData.Location?.Name}
        </CustomText>
        {!isUserInMatch && props.fullwidth && (
          <Button
            disabled={isPastEvent()}
            content={
              isPastEvent()
                ? t('matches:eventEndedButton')
                : isFull()
                ? t('matches:joinWaitingListButton')
                : t('matches:joinEventButton')
            }
            onPress={props.onPress}
            variant={isFull() ? 'waiting' : 'solid'}
            size="small"
            textStyle={styles.fontWeight.fw600}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

export default MatchThumbnail;
