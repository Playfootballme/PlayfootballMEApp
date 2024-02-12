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
import AddGuests from '@components/atoms/add_guests';

import Avatar from '@components/atoms/avatar';

import {useSelector, useDispatch} from 'react-redux';

import {
  rootURL,
  JoinMatch,
  LeaveMatch,
  JoinMatchWaitingList,
  UpdateGuests,
  SendMatchSummary,
} from '@config/functions';

import {
  getLanguage,
  getTimezone,
  getCurrency,
  getMatches,
  getMe,
  getPastMatches,
  getCountry,
} from '@stores/selectors';

import {t} from 'i18next';
import ToggleSwitch from '@components/atoms/toggle_switch';
import {fetchMatch} from '@stores/services';

function MatchScreen(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {matchID, isPast} = props.route.params;
  const currentLang = useSelector(getLanguage);
  const currentTimezone = useSelector(getTimezone);
  const countryCode = useSelector(getCountry);
  const Me = useSelector(getMe);

  const currency = useSelector(getCurrency);
  const upcomingMatches = useSelector(getMatches);
  const pastMatches = useSelector(getPastMatches);

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
      return t('matches:eventEndedButton');
    } else if (isUserInMatch) {
      return t('matches:leaveEventButton');
    } else if (isFullMatch) {
      return t('matches:joinWaitingListButton');
    } else {
      return t('matches:joinEventButton');
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
      return t('matches:confirmLeaveEventMsg');
    } else if (isFullMatch) {
      return t('matches:confirmJoinWaitingListMsg');
    } else {
      return `${t('matches:confirmJoinEventMsg')} ${getPriceWithDiscount()} ${t(
        `common:${currency.toLowerCase()}`,
      )}`;
    }
  };

  const [confirmIcon, setConfirmIcon] = useState('checkmark');
  const [confirmIconColor, setConfirmIconColor] = useState(COLORS.lightGreen);

  const [confirmMessageBody2, setConfirmMessageBody2] = useState(
    t('matches:confirmJoinEventSuccessMsg'),
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
      const join_res = await LeaveMatch(
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
          t('matches:leaveEventButton'),
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
        setConfirmMessageBody2(t('matches:confirmLeaveEventSuccessMsg'));
        setConfirmMessageBody3('');
        setNestedModalIsActive(!nestedModalIsActive);
        setLoadingButton(false);
      }
    }
  };

  const JoinMatchWaitingListHandler = async () => {
    if (Me?.jwt) {
      setLoadingButton(true);

      const join_res = await JoinMatchWaitingList(
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
    setInvitePlayersModal(false);

    if (!match?.registration_open) {
      Alert.alert(
        t('matches:joinEventButton'),
        t('matches:registrationOpenSoon'),
        [
          {
            text: t('common:ok'),
            onPress: cancelAllModalsHandler,
          },
        ],
      );
      return;
    }
    if (Me?.jwt) {
      setLoadingButton(true);
      const join_res = await JoinMatch(
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
          t('matches:joinEventButton'),
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
        setConfirmMessageBody2(t('matches:confirmJoinEventSuccessMsg'));
        setConfirmMessageBody3(
          `${t('matches:confirmJoinEventSuccessMsg2Pt1')} ${moment(
            match?.StartDate,
          )
            .utcOffset(currentTimezone)
            .format('LT')} ${t('matches:confirmJoinEventSuccessMsg2Pt2')}`,
        );
        setNestedModalIsActive(!nestedModalIsActive);

        if (selectedGuests.filter(gu => gu.selected).length > 0) {
          processGuests(
            selectedGuests?.filter(gufa => gufa.selected).map(gu => gu.id),
          );
        } else {
          setLoadingButton(false);
        }
      }
    }
  };

  const [invitePlayersModal, setInvitePlayersModal] = useState(false);
  const [selectedGuests, setSelectedGuests] = useState(
    Me?.data?.Guests.map(guest => {
      return {
        id: guest.id,
        email: guest.email,
        Image: guest.Image,
        FirstName: guest.FirstName,
        LastName: guest.LastName,
        Gender: guest.Gender,
        selected: false,
        loading: false,
        joined: false,
      };
    }),
  );

  const cancelAllModalsHandler = () => {
    new Promise(function (resolve, reject) {
      resolve(setModalIsActive(false));
    })
      .then(function () {
        dispatch(fetchMatch(matchID));
      })
      .then(function () {
        setNestedModalIsActive(false);
        setCancelationAlert(false);
        setSelectedGuests(
          Me?.data?.Guests.map(guest => {
            return {
              id: guest.id,
              email: guest.email,
              Image: guest.Image,
              FirstName: guest.FirstName,
              LastName: guest.LastName,
              Gender: guest.Gender,
              selected: false,
              loading: false,
              joined: false,
            };
          }),
        );
      });
  };

  const selectGuestsHandler = ids => {
    setSelectedGuests(ids);
  };

  const addGuestsHandler = async () => {
    dispatch(fetchMatch(matchID));
    setLoadingButton(true);
    const mapped_players = match?.Players.map(player => player.Player);

    const mapped_players_ids = mapped_players.map(player => player.id);

    for (const guest of selectedGuests?.filter(
      filtered_guest => filtered_guest.selected === true,
    )) {
      if (mapped_players_ids.includes(guest.id)) {
        Alert.alert(
          t('matches:addGuestsLabel'),
          `${guest.FirstName} ${guest.LastName} ${t(
            'matches:alertAddingGust',
          )}`,
          [
            {
              text: t('common:tryAgain'),
              onPress: () => setLoadingButton(false),
            },
          ],
        );
        return;
      }
    }

    const guests_to_save_in_history = [
      ...Me?.data?.Guests.map(guest => guest.id),
      ...selectedGuests
        .filter(guest => guest.selected === true)
        .map(guest => guest.id),
    ];

    const response = await UpdateGuests(
      Me?.data?.id,
      Me?.jwt,
      guests_to_save_in_history,
    );

    if (response.status === 200) {
      setNestedModalIsActive(false);
      setLoadingButton(false);
    }
  };

  const processGuests = async guests => {
    setLoadingButton(true);

    const updatedGuests = selectedGuests
      .filter(guest => guest.selected)
      .map(guest => ({
        ...guest,
        loading: true,
      }));
    setSelectedGuests(updatedGuests);

    for (const guestId of guests) {
      const guestToUpdate = selectedGuests.find(guest => guest.id === guestId);

      try {
        const join_res = await JoinMatch(
          guestId,
          match.id,
          Me?.jwt,
          false,
          Intl.DateTimeFormat().resolvedOptions().timeZone,
        );

        if (
          typeof join_res.data[currentLang] === 'string' &&
          join_res.data[currentLang].includes('error')
        ) {
          Alert.alert(
            t('matches:addGuestsLabel'),
            join_res.data[currentLang].split('error:')[1],
          );
          guestToUpdate.loading = false;
          guestToUpdate.joined = false;
        } else if (join_res.status === 200) {
          guestToUpdate.loading = false;
          guestToUpdate.joined = true;
        }
      } catch (error) {
        console.error(error);
        guestToUpdate.loading = false;
        guestToUpdate.joined = false;
      }

      setSelectedGuests(prevGuests => {
        const updatedGuests = prevGuests.map(guest =>
          guest.id === guestId ? guestToUpdate : guest,
        );
        return updatedGuests;
      });
    }

    setLoadingButton(false);
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
            setInvitePlayersModal(true);
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

  const canHandleExpenses = () => {
    return (
      Me?.data?.role?.type === 'organizer' ||
      (Me?.data?.role?.type === 'referee' && Me?.data?.isOrganizer)
    );
  };
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

      {!(isUserInMatch || isFullMatch) && (
        <View style={[styles.rowContainer, styles.alignCenter]}>
          <ToggleSwitch
            isOn={gkSwitch}
            onColor={COLORS.blue}
            offColor={COLORS.grey2}
            animationSpeed={100}
            onToggle={isOn => setGkSwitch(!gkSwitch)}
          />
          <CustomText
            style={[styles.fontSize.small, {marginLeft: METRICS.spaceTiny}]}>
            {`${t('matches:joinGKMsgPt1')} ${match?.GKDiscount}${t(
              'matches:joinGKMsgPt2',
            )}`}
          </CustomText>
        </View>
      )}

      <View style={styles.buttonRow}>
        {!(isUserInMatch || isFullMatch) && (
          <Button
            content={
              selectedGuests?.filter(guest => guest.selected === true).length >
              0
                ? `${
                    selectedGuests?.filter(guest => guest.selected === true)
                      .length
                  } ${t('common:selectedLabel')}`
                : t('matches:addGuestsLabel')
            }
            disabled={loadingButton}
            loading={loadingButton}
            onPress={() => {
              dispatch(fetchMatch(matchID));
              setNestedModalIsActive(true);
            }}
            variant={'adding'}
            size="normal"
            halfWidth
            style={{marginRight: METRICS.spaceTiny}}
          />
        )}

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
          halfWidth={!(isUserInMatch || isFullMatch)}
          fullWidth={isUserInMatch || isFullMatch}
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

        {selectedGuests?.length > 0 && (
          <View style={[{marginVertical: METRICS.spaceMedium}]}>
            {selectedGuests
              .filter(tg => tg.selected === true)
              .map((this_guest, index) => {
                return (
                  <View
                    key={index}
                    style={[
                      styles.rowContainer,
                      styles.alignCenter,
                      styles.justifyBetween,
                      {marginBottom: METRICS.spaceSmall},
                    ]}>
                    <View style={[styles.rowContainer, styles.alignCenter]}>
                      <Avatar
                        img={
                          this_guest?.Image
                            ? `${rootURL}${this_guest?.Image?.url}`
                            : null
                        }
                        name={
                          this_guest?.FirstName + ' ' + this_guest?.LastName
                        }
                        size={'small'}
                      />
                      <View style={[{marginLeft: METRICS.spaceTiny}]}>
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
                    </View>

                    {this_guest.loading ? (
                      <ActivityIndicator size="small" color={'#fff'} />
                    ) : this_guest?.joined ? (
                      <View
                        style={[
                          styles.iconCircle,
                          {
                            backgroundColor: COLORS.lightGreen,
                            width: 20,
                            height: 20,
                            borderWidth: 1,
                            borderColor: COLORS.lightGreen,
                            marginLeft: METRICS.spaceTiny,
                          },
                        ]}>
                        <Icon name="checkmark" size={12} color={COLORS.white} />
                      </View>
                    ) : (
                      <View
                        style={[
                          styles.iconCircle,
                          {
                            backgroundColor: COLORS.red,
                            width: 20,
                            height: 20,
                            borderWidth: 1,
                            borderColor: COLORS.red,
                            marginLeft: METRICS.spaceTiny,
                          },
                        ]}>
                        <Icon name="close" size={12} color={COLORS.white} />
                      </View>
                    )}
                  </View>
                );
              })}
          </View>
        )}

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

      <AddGuests
        selectedGuests={selectedGuests}
        selectGuests={selectGuestsHandler}
        match={match}
      />

      <Button
        content={`${t('matches:addLabel')} ${
          selectedGuests?.filter(guest => guest.selected === true).length
        }`}
        onPress={addGuestsHandler}
        disabled={
          selectedGuests?.filter(guest => guest.selected === true).length === 0
        }
        loading={loadingButton}
        variant="solid"
        size="normal"
        fullWidth
        style={{marginBottom: METRICS.spaceMedium}}
      />
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

  const [buttonSummary, setButtonSummary] = useState({
    content: t('matches:sendMatchSummary'),
    loading: false,
    disabled: false,
  });
  const SendMatchSummaryHandler = async () => {
    setButtonSummary({...buttonSummary, loading: true, disabled: true});
    const response = await SendMatchSummary(matchID, Me?.jwt);

    if (response.status === 200) {
      setButtonSummary({
        content: t('common:sentLabel'),
        loading: false,
        disabled: true,
      });
      setTimeout(() => {
        setButtonSummary({
          content: t('matches:sendMatchSummary'),
          loading: false,
          disabled: false,
        });
      }, 5000);
    } else {
      setButtonSummary({
        content: t('common:somethingWentWrong'),
        loading: false,
        disabled: true,
      });
      setTimeout(() => {
        setButtonSummary({
          content: t('matches:sendMatchSummary'),
          loading: false,
          disabled: false,
        });
      }, 5000);
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
      setNestedModalIsActive={() =>
        invitePlayersModal
          ? setNestedModalIsActive(!nestedModalIsActive)
          : cancelAllModalsHandler()
      }
      nestedModalBody={
        invitePlayersModal ? SecondNestedModalBody : NestedModalBody
      }>
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
                  matchType: 'match',
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

          {canHandleExpenses() && (
            <TouchableOpacity
              style={styles.modalRow}
              onPress={() =>
                navigation.navigate('MatchStack', {
                  screen: 'ExpensesScreen',
                  params: {
                    matchID: matchID,
                    isPast: isPast,
                    matchType: 'match',
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

          {canHandleExpenses() && (
            <View style={styles.modalRow}>
              <View style={[styles.rowContainer, styles.alignCenter]}>
                <Icon name="completed" size={20} color={COLORS.white} />

                <CustomText
                  style={[
                    styles.fontSize.normal,
                    {marginLeft: METRICS.spaceTiny},
                  ]}>
                  {t('matches:matchSummaryLabel')}
                </CustomText>
              </View>
              <Button
                content={buttonSummary.content}
                variant={'solid'}
                size="small"
                loading={buttonSummary.loading}
                disabled={buttonSummary.disabled}
                onPress={SendMatchSummaryHandler}
              />
            </View>
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

export default MatchScreen;
