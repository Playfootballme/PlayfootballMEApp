import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import HeroContainer from '@containers/hero_container';
import Button from '@components/atoms/button';
import {METRICS} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import {styles} from '@styles';
import {
  TouchableOpacity,
  View,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import CustomText from '@components/custom/custom_text';
import moment from 'moment';
import Icon from '@components/atoms/icon';

import Avatar from '@components/atoms/avatar';

import {useSelector, useDispatch} from 'react-redux';

import {
  rootURL,
  JoinTournament,
  LeaveTournament,
  JoinTournamentWaitingList,
} from '@config/functions';

import {
  getCountry,
  getLanguage,
  getTimezone,
  getCurrency,
  getTournaments,
  getMe,
  getPastMatches,
} from '@stores/selectors';

import {t} from 'i18next';
import {fetchTournament} from '@stores/services';

function TournamentScreen(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {matchID, isPast} = props.route.params;
  const currentLang = useSelector(getLanguage);
  const currentTimezone = useSelector(getTimezone);

  const Me = useSelector(getMe);

  const currency = useSelector(getCurrency);
  const upcomingMatches = useSelector(getTournaments);
  const pastMatches = useSelector(getPastMatches);
  const countryCode = useSelector(getCountry);
  const match = isPast
    ? pastMatches?.find(m => m.id === matchID)
    : upcomingMatches?.find(m => m.id === matchID);

  const [modalIsActive, setModalIsActive] = useState(false);
  const [nestedModalIsActive, setNestedModalIsActive] = useState(false);

  const [loadingButton, setLoadingButton] = useState(false);

  const onPressBack = () => {
    navigation.goBack();
  };

  const facilitiesIcons = [];
  for (const key in match?.Location.Facilities) {
    if (match?.Location.Facilities[key]) {
      if (key !== 'id') {
        facilitiesIcons.push(
          <View
            style={[{marginRight: METRICS.spaceTiny}, styles.alignCenter]}
            key={key}>
            <Icon name={key.toLowerCase()} size={18} color={COLORS.white} />
            <CustomText
              prettify={true}
              style={[styles.fontSize.tiny, {marginTop: METRICS.spaceTiny}]}>
              {t(`matches:${key.toLocaleLowerCase()}`)}
            </CustomText>
          </View>,
        );
      }
    }
  }

  var todayDate = moment();
  var startTime = moment(match?.StartDate);
  var endTime = moment(match?.EndDate);

  var minutesDiff = endTime.diff(startTime, 'minutes');
  var hoursDiff = endTime.diff(startTime, 'hours', true);

  const isPastEvent = todayDate.isAfter(endTime);

  const isFullMatch = match?.Players?.length >= match?.Capacity;

  const matchPlayers = match?.Players?.map(p => p?.Player?.id);
  const isUserInMatch = matchPlayers?.includes(Me?.data?.id);

  const joinButtonText = () => {
    if (isPastEvent) {
      return t('tournaments:eventEndedButton');
    } else if (isUserInMatch) {
      return t('tournaments:leaveEventButton');
    } else if (isFullMatch) {
      return t('tournaments:joinWaitingListButton');
    } else {
      return t('tournaments:joinEventButton');
    }
  };

  const confirmMessageTitle = () => {
    if (isUserInMatch) {
      return t('matches:confirmLeaveEvent');
    } else if (isFullMatch) {
      return t('matches:confirmJoinWaitingList');
    } else {
      return t('matches:confirmJoinEvent');
    }
  };

  const getPriceWithDiscount = () => {
    if (gkSwitch) {
      const originalPrice = match?.Price;
      const discount = match?.GKDiscount;

      if (originalPrice !== undefined && discount !== undefined) {
        return originalPrice - originalPrice * (discount / 100);
      } else {
        return originalPrice;
      }
    } else {
      return match?.Price;
    }
  };

  const confirmMessageBody = () => {
    if (isUserInMatch) {
      return t('tournaments:confirmLeaveEventMsg');
    } else if (isFullMatch) {
      return t('matches:confirmJoinWaitingListMsg');
    } else {
      return `${t(
        'tournaments:confirmJoinEventMsg',
      )} ${getPriceWithDiscount()} ${t(`common:${currency.toLowerCase()}`)}`;
    }
  };

  const [confirmIcon, setConfirmIcon] = useState('checkmark');
  const [confirmIconColor, setConfirmIconColor] = useState(COLORS.lightGreen);

  const [confirmMessageBody2, setConfirmMessageBody2] = useState(
    t('tournaments:confirmJoinEventSuccessMsg'),
  );

  const [confirmMessageBody3, setConfirmMessageBody3] = useState(
    `${t('matches:confirmJoinEventSuccessMsg2Pt1')} ${moment(match?.EndDate)
      .utcOffset(currentTimezone)
      .format('LT')} ${t('matches:confirmJoinEventSuccessMsg2Pt2')}`,
  );

  //players modal props
  const [displayPlayers, setDisplayPlayers] = useState(false);

  const LeaveMatchHandler = async () => {
    if (Me?.jwt) {
      setLoadingButton(true);
      const join_res = await LeaveTournament(
        Me?.data?.id,
        match.id,
        Me?.jwt,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        true,
      );

      if (
        typeof join_res.data[currentLang] === 'string' &&
        join_res.data[currentLang].includes('error')
      ) {
        Alert.alert(
          t('tournaments:leaveEventButton'),
          join_res.data[currentLang].split('error:')[1],
          [
            {
              text: t('common:tryAgain'),
              onPress: () => setLoadingButton(false),
            },
          ],
        );
        return;
      }
      if (join_res.status === 200) {
        setConfirmIcon('close');
        setConfirmIconColor(COLORS.red);
        setConfirmMessageBody2(t('tournaments:confirmLeaveEventSuccessMsg'));
        setConfirmMessageBody3('');
        setNestedModalIsActive(!nestedModalIsActive);
        setLoadingButton(false);
      }
    }
  };

  const JoinMatchWaitingListHandler = async () => {
    if (Me?.jwt) {
      setLoadingButton(true);

      const join_res = await JoinTournamentWaitingList(
        Me?.data?.id,
        match.id,
        Me?.jwt,
      );

      if (
        typeof join_res.data[currentLang] === 'string' &&
        join_res.data[currentLang].includes('error')
      ) {
        Alert.alert(
          t('matches:joinWaitingListButton'),
          join_res.data[currentLang].split('error:')[1],
          [
            {
              text: t('common:tryAgain'),
              onPress: () => setLoadingButton(false),
            },
          ],
        );
        return;
      }
      if (join_res.status === 200) {
        setConfirmIcon('bell');
        setConfirmIconColor(COLORS.backgroundYellow);
        setConfirmMessageBody2(t('matches:confirmJoinWaitingListSuccessMsg'));
        setConfirmMessageBody3(t('matches:confirmJoinWaitingListMsg'));
        setNestedModalIsActive(!nestedModalIsActive);
        setLoadingButton(false);
      }
    }
  };

  const JoinMatchHandler = async () => {
    if (Me?.jwt) {
      setLoadingButton(true);
      const join_res = await JoinTournament(
        Me?.data?.id,
        match.id,
        Me?.jwt,
        gkSwitch,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      );

      if (
        typeof join_res.data[currentLang] === 'string' &&
        join_res.data[currentLang].includes('error')
      ) {
        Alert.alert(
          t('tournaments:joinEventButton'),
          join_res.data[currentLang].split('error:')[1],
          [
            {
              text: t('common:tryAgain'),
              onPress: () => setLoadingButton(false),
            },
          ],
        );
        return;
      }
      if (join_res.status === 200) {
        setConfirmIcon('checkmark');
        setConfirmIconColor(COLORS.lightGreen);
        setConfirmMessageBody2(t('tournaments:confirmJoinEventSuccessMsg'));
        setConfirmMessageBody3(
          `${t('tournaments:confirmJoinEventSuccessMsg2Pt1')} ${moment(
            match?.StartDate,
          )
            .utcOffset(currentTimezone)
            .format('LT')} ${t('matches:confirmJoinEventSuccessMsg2Pt2')}`,
        );
        setNestedModalIsActive(!nestedModalIsActive);

        setLoadingButton(false);
      }
    }
  };

  const cancelAllModalsHandler = () => {
    new Promise(function (resolve, reject) {
      resolve(setModalIsActive(!modalIsActive));
    })
      .then(function () {
        dispatch(fetchTournament(matchID));
      })
      .then(function () {
        setNestedModalIsActive(!nestedModalIsActive);
        setCancelationAlert(false);
      });
  };

  const bottomButton = !displayPlayers && (
    <View style={[styles.container, styles.buttonRow]}>
      <Button
        content={joinButtonText()}
        disabled={isPastEvent}
        variant={
          isUserInMatch && !isPastEvent
            ? 'cancel'
            : isFullMatch
            ? 'waiting'
            : 'solid'
        }
        size="normal"
        fullWidth
        onPress={() => {
          if (Me?.data) {
            setModalIsActive(!modalIsActive);
            if (isUserInMatch || isFullMatch) {
              // Calculate the current date and time using moment
              const currentDate = moment();

              const gameStartDate = moment(match?.StartDate);

              // Calculate the time difference
              // Calculate the time difference in hours
              const timeDifferenceInHours = gameStartDate.diff(
                currentDate,
                'hours',
              );

              setCancelationAlert(isUserInMatch && timeDifferenceInHours <= 4);
              return;
            }
          } else {
            Alert.alert(
              t('common:signInRequired'),
              t('common:alertSignInRequired'),
              [
                {
                  text: t('more:signInButton'),
                  onPress: () => {
                    navigation.navigate('LandingStack', {
                      screen: 'SignInScreen',
                    });
                  },
                },
                {
                  text: t('common:cancel'),
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
              ],
            );
          }
        }}
      />
    </View>
  );

  const [gkSwitch, setGkSwitch] = useState(false);

  const [showCancelationAlert, setCancelationAlert] = useState(false);
  const ModalBody = (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          marginBottom: METRICS.spaceMedium,
        }}>
        <CustomText style={[styles.fontSize.compact, styles.fontWeight.fw600]}>
          {confirmMessageTitle()}
        </CustomText>

        <CustomText style={[styles.fontSize.normal, styles.fontWeight.fw600]}>
          {currentLang === 'ar'
            ? match?.NameAR
              ? match?.NameAR
              : match?.Name
            : match?.Name}
        </CustomText>
      </View>

      {showCancelationAlert && (
        <View
          style={[
            styles.alignCenter,
            styles.justifyCenter,
            {
              paddingVertical: METRICS.spaceNormal,
              paddingHorizontal: METRICS.spaceNormal,
              borderRadius: METRICS.borderRadiusMedium,
              borderColor: COLORS.backgroundIconRed,
              borderWidth: 1,
              borderStyle: 'dashed',
              marginBottom: METRICS.spaceSmall,
            },
          ]}>
          <Icon name="diamond-exclamation" size={25} color={COLORS.red} />
          <CustomText
            style={[
              styles.fontSize.normal,
              styles.fontWeight.fw700,
              {color: COLORS.red, textAlign: 'center'},
            ]}>
            {t('matches:warningLabel')}
          </CustomText>
          <CustomText
            style={[
              styles.fontSize.small,
              styles.fontWeight.fw400,
              {color: COLORS.red, textAlign: 'center'},
            ]}>
            {t('matches:warningMsg')}
          </CustomText>
        </View>
      )}

      <View
        style={{
          marginBottom: METRICS.spaceMedium,
        }}>
        <CustomText style={[styles.fontSize.normal, styles.fontWeight.fw400]}>
          {confirmMessageBody()}
        </CustomText>
      </View>

      <View style={styles.buttonRow}>
        <Button
          content={
            isUserInMatch ? t('matches:leaveButton') : t('matches:confirmLabel')
          }
          disabled={loadingButton}
          loading={loadingButton}
          onPress={
            isUserInMatch
              ? LeaveMatchHandler
              : isFullMatch
              ? JoinMatchWaitingListHandler
              : JoinMatchHandler
          }
          variant={
            isUserInMatch && !isPastEvent
              ? 'cancel'
              : isFullMatch
              ? 'waiting'
              : 'solid'
          }
          size="normal"
          fullWidth={true}
        />
      </View>
    </View>
  );

  const NestedModalBody = (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <View style={[styles.flex, {alignItems: 'center'}]}>
        <View
          style={[
            styles.modalConfirmIcon,
            {
              marginBottom: METRICS.spaceSmall,
              backgroundColor: confirmIconColor,
            },
          ]}>
          <Icon name={confirmIcon} size={100} color={COLORS.white} />
        </View>
        <CustomText
          style={[
            styles.fontSize.compact,
            styles.fontWeight.fw600,
            {textAlign: 'center', marginBottom: METRICS.spaceTiny},
          ]}>
          {confirmMessageBody2}
        </CustomText>

        <CustomText
          style={[
            styles.fontSize.normal,
            {textAlign: 'center', marginBottom: METRICS.spaceSmall},
          ]}>
          {confirmMessageBody3}
        </CustomText>

        <Button
          loading={loadingButton}
          disabled={loadingButton}
          content={t('matches:doneButton')}
          onPress={() => {
            cancelAllModalsHandler();
          }}
          variant="solid"
          size="normal"
          fullWidth
        />
      </View>
    </View>
  );

  const SecondNestedModalBody = (
    <View
      style={{
        flex: 1,
      }}>
      <View>
        <CustomText
          style={[
            styles.fontSize.normal,
            styles.fontWeight.fw600,
            {
              marginBottom: METRICS.spaceTiny,
            },
          ]}>
          {t('matches:addGuestsLabel')}
        </CustomText>

        <CustomText
          style={[styles.fontSize.small, {marginBottom: METRICS.spaceMedium}]}>
          {t('common:searchByEmailLabel')}
        </CustomText>
      </View>
    </View>
  );

  const calculateExpenses = () => {
    if (!match?.Expenses) {
      return t('matches:noDataFound');
    } else {
      // Create a new object excluding "Note" and "ID"
      const filteredExpenses = Object.fromEntries(
        Object.entries(match?.Expenses).filter(
          ([key]) => key !== 'OtherDescription' && key !== 'id',
        ),
      );

      // Calculate the total expenses
      const totalExpenses = Object.values(filteredExpenses).reduce(
        (acc, expense) => acc + expense,
        0,
      );

      return `${totalExpenses} ${t(`common:${currency.toLowerCase()}`)}`;
    }
  };

  return (
    <HeroContainer
      title={
        currentLang === 'ar'
          ? match?.NameAR
            ? match?.NameAR
            : match?.Name
          : match?.Name
      }
      onPressBack={onPressBack}
      bottomButton={bottomButton}
      modalIsActive={modalIsActive}
      setModalIsActive={() => {
        setModalIsActive(!modalIsActive);
        setTimeout(() => {
          setCancelationAlert(false);
        }, 500);
      }}
      modalBody={ModalBody}
      nestedModalStyle={'fullWithEdge'}
      nestedModalIsActive={nestedModalIsActive}
      setNestedModalIsActive={cancelAllModalsHandler}
      nestedModalBody={NestedModalBody}>
      <View style={[styles.container]}>
        <View>
          <View style={[styles.modalFirstRow]}>
            <View
              style={[
                styles.rowContainer,
                styles.justifyBetween,
                styles.alignCenter,
                {marginBottom: METRICS.spaceXTiny},
              ]}>
              <View
                style={[
                  styles.iconBackground,
                  {marginRight: METRICS.spaceSmall},
                ]}>
                <Icon name="football" size={30} color={COLORS.white} />
              </View>
              <View style={[styles.flex, {alignItems: 'flex-start'}]}>
                <CustomText
                  style={[
                    styles.fontSize.small,
                    {marginBottom: METRICS.spaceXTiny},
                  ]}>
                  {moment(match?.StartDate)
                    .utcOffset(currentTimezone)
                    .format('dddd DD/MM/YY LT') +
                    ' - ' +
                    moment(match?.EndDate)
                      .utcOffset(currentTimezone)
                      .format('LT')}
                </CustomText>
                <CustomText
                  style={[
                    styles.fontSize.small,
                    {marginBottom: METRICS.spaceSmall},
                  ]}>
                  {currentLang === 'ar'
                    ? match?.Location?.NameAR
                      ? match?.Location?.NameAR
                      : match?.Location?.Name
                    : match?.Location?.Name}
                </CustomText>
                <View style={[styles.rowContainer, styles.alignCenter]}>
                  {facilitiesIcons}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.modalRow}>
            <View style={[styles.rowContainer, styles.alignCenter]}>
              <Icon name="football-field" size={20} color={COLORS.white} />
              <CustomText
                style={[
                  styles.fontSize.normal,
                  {marginLeft: METRICS.spaceTiny},
                ]}>
                {t('matches:pitchTypeLabel')}
              </CustomText>
            </View>
            <CustomText style={[styles.fontSize.normal]}>
              {t(`matches:${match?.Location?.Type.toLowerCase()}`)}
            </CustomText>
          </View>

          <View style={styles.modalRow}>
            <View style={[styles.rowContainer, styles.alignCenter]}>
              <Icon name="gender" size={20} color={COLORS.white} />
              <CustomText
                style={[
                  styles.fontSize.normal,
                  {marginLeft: METRICS.spaceTiny},
                ]}>
                {t('matches:genderLabel')}
              </CustomText>
            </View>
            <CustomText style={[styles.fontSize.normal]}>
              {t(`matches:${match?.Gender.toLowerCase()}`)}
            </CustomText>
          </View>

          <View style={styles.modalRow}>
            <View style={[styles.rowContainer, styles.alignEnd]}>
              <View style={[styles.rowContainer, styles.alignCenter]}>
                <Icon name="money" size={20} color={COLORS.white} />
                <CustomText
                  style={[
                    styles.fontSize.normal,
                    {marginLeft: METRICS.spaceTiny},
                  ]}>
                  {t('matches:priceLabel')}
                </CustomText>
              </View>
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
            <CustomText style={[styles.fontSize.normal]}>
              {`${match?.Price} ${t(`common:${currency.toLowerCase()}`)}`}
            </CustomText>
          </View>

          <View style={styles.modalRow}>
            <View style={[styles.rowContainer, styles.alignCenter]}>
              <Icon name="stopwatch" size={20} color={COLORS.white} />
              <CustomText
                style={[
                  styles.fontSize.normal,
                  {marginLeft: METRICS.spaceTiny},
                ]}>
                {t('matches:durationLabel')}
              </CustomText>
            </View>
            <CustomText style={[styles.fontSize.normal]}>{`${minutesDiff} ${t(
              'matches:durationMinutes',
            )} (${hoursDiff} ${t('matches:durationHours')})`}</CustomText>
          </View>

          <View style={styles.modalRow}>
            <View style={[styles.rowContainer, styles.alignCenter]}>
              <Icon name="calendar" size={20} color={COLORS.white} />
              <CustomText
                style={[
                  styles.fontSize.normal,
                  {marginLeft: METRICS.spaceTiny},
                ]}>
                {t('matches:ageLabel')}
              </CustomText>
            </View>
            <CustomText style={[styles.fontSize.normal]}>{`${match?.MinAge} - ${
              match?.MaxAge ? match?.MaxAge : 60
            }`}</CustomText>
          </View>

          <TouchableOpacity
            style={styles.modalRow}
            onPress={() =>
              navigation.navigate('PlayersStack', {
                screen: 'PlayersScreen',
                params: {
                  matchID: matchID,
                  matchType: 'tournament',
                },
              })
            }>
            <View style={[styles.rowContainer, styles.alignCenter]}>
              <Icon name="user" size={20} color={COLORS.white} />

              <CustomText
                style={[
                  styles.fontSize.normal,
                  {marginLeft: METRICS.spaceTiny},
                ]}>
                {isFullMatch
                  ? `${t('matches:playersLabel')} (${match?.Players?.length}/${
                      match?.Capacity
                    }) - ${t('matches:playersFull')}`
                  : `${t('matches:playersLabel')} (${match?.Players?.length}/${
                      match?.Capacity
                    })`}
              </CustomText>
            </View>
            <View>
              {match?.Players?.length > 0 && (
                <View style={[styles.rowContainer]}>
                  {match?.Players?.slice(0, 3).map((el, index) => (
                    <Avatar
                      key={index}
                      img={
                        el?.Player?.Image
                          ? `${rootURL}${el?.Player?.Image.url}`
                          : null
                      }
                      name={el?.Player?.FirstName + ' ' + el?.Player?.LastName}
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
                  ))}

                  {match?.Players?.length > 3 && (
                    <Avatar
                      backgroundColor={COLORS.lightGrey}
                      name={`+ ${match?.Players?.length - 3}`}
                      size="small"
                      style={{marginLeft: -METRICS.spaceTiny, zIndex: 0}}
                    />
                  )}
                </View>
              )}
            </View>
          </TouchableOpacity>

          {Me?.data?.role?.type === 'organizer' && (
            <TouchableOpacity
              style={styles.modalRow}
              onPress={() =>
                navigation.navigate('MatchStack', {
                  screen: 'ExpensesScreen',
                  params: {
                    matchID: matchID,
                    isPast: isPast,
                    matchType: 'tournament',
                  },
                })
              }>
              <View style={[styles.rowContainer, styles.alignCenter]}>
                <Icon name="money-monitor" size={20} color={COLORS.white} />

                <CustomText
                  style={[
                    styles.fontSize.normal,
                    {marginLeft: METRICS.spaceTiny},
                  ]}>
                  {t('matches:expensesLabel')}
                </CustomText>
              </View>
              <CustomText style={[styles.fontSize.normal]}>
                {calculateExpenses()}
              </CustomText>
            </TouchableOpacity>
          )}

          {match?.Location && (
            <View style={styles.modalRow}>
              <View style={[styles.rowContainer, styles.alignCenter]}>
                <Icon name="map-marker" size={20} color={COLORS.white} />
                <CustomText
                  style={[
                    styles.fontSize.normal,
                    {marginLeft: METRICS.spaceTiny},
                  ]}>
                  {t('matches:directionsLabel')}
                </CustomText>
              </View>
              <TouchableOpacity
                style={{alignItems: 'flex-end'}}
                onPress={() => Linking.openURL(match?.Location.GoogleMapLink)}>
                <CustomText style={[styles.fontSize.normal]}>
                  {t('matches:viewOnMapLabel')}
                </CustomText>

                <CustomText style={[styles.fontSize.tiny]}>
                  {currentLang === 'ar'
                    ? match?.Location?.NameAR
                      ? match?.Location?.NameAR
                      : match?.Location?.Name
                    : match?.Location?.Name}
                </CustomText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </HeroContainer>
  );
}

export default TournamentScreen;
