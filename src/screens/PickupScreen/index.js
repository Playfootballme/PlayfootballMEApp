import React from 'react';
import {useNavigation, CommonActions} from '@react-navigation/native';

import HeroContainer from '@containers/hero_container';
import Button from '@components/atoms/button';
import {METRICS} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import {styles} from '@styles';
import {Alert, Linking, TouchableOpacity, View} from 'react-native';
import CustomText from '@components/custom/custom_text';
import {useSelector, useDispatch} from 'react-redux';

import moment from 'moment';
import OpenSpot from '@components/atoms/open_spot';
import Avatar from '@components/atoms/avatar';
import {
  getCurrency,
  getPickups,
  getMe,
  getCountry,
  getPastPickups,
  getTimezone,
} from '@stores/selectors';
import Icon from '@components/atoms/icon';

import Input from '@components/atoms/input';

import {
  rootURL,
  JoinPickupWaitingList,
  JoinPickup,
  LeavePickup,
} from '@config/functions';

import {fetchRegisteredPlayersOfPickup} from '@stores/services';
import {useStateIfMounted} from 'use-state-if-mounted';

function PickupScreen(props) {
  const navigation = useNavigation();
  const {pickupID, isPast} = props.route.params;

  const dispatch = useDispatch();

  const Me = useSelector(getMe);
  const currentTimezone = useSelector(getTimezone);

  const currency = useSelector(getCurrency);
  const upcomingPickups = useSelector(getPickups);
  const pastPickups = useSelector(getPastPickups);
  const countryCode = useSelector(getCountry);

  const match = isPast
    ? pastPickups.find(m => m.id === pickupID)
    : upcomingPickups.find(m => m.id === pickupID);

  const onPressBack = () => {
    navigation.goBack();
  };

  const facilitiesIcons = [];
  for (const key in match?.attributes.Location.data.attributes.Facilities) {
    if (match?.attributes.Location.data.attributes.Facilities[key]) {
      if (key !== 'id') {
        facilitiesIcons.push(
          <View
            style={[{marginRight: METRICS.spaceTiny}, styles.alignCenter]}
            key={key}>
            <Icon name={key.toLowerCase()} size={18} color={COLORS.white} />
            <CustomText
              prettify={true}
              style={[styles.fontSize.tiny, {marginTop: METRICS.spaceTiny}]}>
              {key}
            </CustomText>
          </View>,
        );
      }
    }
  }

  const [modalIsActive, setModalIsActive] = useStateIfMounted(false);
  const [nestedModalIsActive, setNestedModalIsActive] =
    useStateIfMounted(false);
  const [teamToDisplay, setTeamToDisplay] = useStateIfMounted(null);
  const [displayPlayers, setDisplayPlayers] = useStateIfMounted(false);

  const [loadingButton, setLoadingButton] = useStateIfMounted(false);

  const displayPlayersHandler = team => {
    setDisplayPlayers(!displayPlayers);
    setTeamToDisplay(team);
  };

  const [pickupInviteType, setPickupInviteType] = useStateIfMounted(false);
  const [inputCodeDialog, setInputCodeDialog] = useStateIfMounted(false);
  const [teamName, setTeamName] = useStateIfMounted('');
  const [teamUID, setTeamUID] = useStateIfMounted('');
  const setInviteToPickupModalVisibleHandler = async tn => {
    setTeamName(tn.split(' ').join(''));
    setPickupInviteType(true);
  };

  const LeavePickupHandler = async () => {
    if (Me?.jwt) {
      setLoadingButton(true);
      const join_res = await LeavePickup(Me?.data?.id, match?.id, Me?.jwt);

      if (
        typeof join_res.data === 'string' &&
        join_res.data.includes('error')
      ) {
        Alert.alert('Error', join_res.data.split('error:')[1]);
        return;
      }

      if (join_res.status === 200) {
        setConfirmPickupIconColor(COLORS.red);
        setConfirmPickupIcon('close');
        setConfirmPickupMessageBody('You have successfully left the match');
        setNestedModalIsActive(!nestedModalIsActive);
        setLoadingButton(false);
      }
    }
  };

  const JoinPickupHandler = async (isPublic = false) => {
    if (Me?.jwt) {
      setLoadingButton(true);

      const join_res = await JoinPickup(
        teamName,
        Me?.data?.id,
        match?.id,
        Me?.jwt,
        isPublic,
      );

      if (
        typeof join_res.data === 'string' &&
        join_res.data.includes('error')
      ) {
        Alert.alert('Error', join_res.data.split('error:')[1]);
        return;
      }

      if (join_res.status === 200) {
        setConfirmPickupIconColor(COLORS.lightGreen);
        setConfirmPickupIcon('checkmark');
        setConfirmPickupMessageBody('You have successfully joined the match');
        setTeamUID(isPublic ? '' : join_res.data[`${teamName}UID`]);
        setNestedModalIsActive(!nestedModalIsActive);
        setLoadingButton(false);
      }
    }
  };

  const joinTeamImmediately = async tn => {
    if (Me?.jwt) {
      setLoadingButton(true);

      const join_res = await JoinPickup(
        tn.split(' ').join(''),
        Me?.data?.id,
        match?.id,
        Me?.jwt,
        true,
      );
      if (
        typeof join_res.data === 'string' &&
        join_res.data.includes('error')
      ) {
        Alert.alert('Error', join_res.data.split('error:')[1]);
      } else {
        setConfirmPickupIconColor(COLORS.lightGreen);
        setConfirmPickupIcon('checkmark');
        setConfirmPickupMessageBody('You have successfully joined the match');
        setNestedModalIsActive(!nestedModalIsActive);
        setLoadingButton(false);
      }
    }
  };

  const JoinPickupWaitingListHandler = async tn => {
    setPickupInviteType(false);
    if (Me?.jwt) {
      setLoadingButton(true);

      const join_res = await JoinPickupWaitingList(
        tn.split(' ').join(''),
        Me?.data?.id,
        match?.id,
        Me?.jwt,
      );
      if (
        typeof join_res.data === 'string' &&
        join_res.data.includes('error')
      ) {
        Alert.alert('Error', join_res.data.split('error:')[1]);
        return;
      }

      if (join_res.status === 200) {
        setConfirmPickupIconColor(COLORS.lightGreen);
        setConfirmPickupIcon('bell');
        setConfirmPickupMessageBody(
          'You have successfully joined the waiting list',
        );
        setNestedModalIsActive(!nestedModalIsActive);
        setLoadingButton(false);
      }
    }
  };

  const enterCodeToJoinTeam = tn => {
    setTeamName(tn.split(' ').join(''));
    // setNestedModalIsActive(!nestedModalIsActive);
    setInputCodeDialog(true);
  };

  const [joiningCode, setJoiningCode] = useStateIfMounted('');

  const onChangeJoiningCode = code => {
    setJoiningCode(code);
  };

  const checkCode = async () => {
    if (!joiningCode || match?.attributes[`${teamName}UID`] !== joiningCode) {
      Alert.alert('Error', 'Please enter a valid code');
      return;
    }
    if (match?.attributes[`${teamName}UID`] === joiningCode) {
      if (Me?.jwt) {
        setLoadingButton(true);

        const join_res = await JoinPickup(
          teamName,
          Me?.data?.id,
          match?.id,
          Me?.jwt,
          false,
        );
        if (
          typeof join_res.data === 'string' &&
          join_res.data.includes('error')
        ) {
          Alert.alert('Error', join_res.data.split('error:')[1]);
          return;
        }

        if (join_res.status === 200) {
          setConfirmPickupIconColor(COLORS.lightGreen);
          setConfirmPickupIcon('checkmark');
          setConfirmPickupMessageBody('You have successfully joined the match');
          setNestedModalIsActive(!nestedModalIsActive);
          setLoadingButton(false);
        }
      }
    }
  };

  // pickup date and time
  var todayDate = moment();

  var pickupStartTime = moment(match?.attributes.StartDate);
  var pickupEndTime = moment(match?.attributes.EndDate);
  var pickupHoursDiff = pickupEndTime.diff(pickupStartTime, 'hours', true);
  var pickupMinutesDiff = pickupEndTime.diff(pickupStartTime, 'minutes');
  const isPastEvent = todayDate.isAfter(pickupEndTime);

  const isFullPickup = () => {
    return (
      match?.attributes.TeamA.length +
        match?.attributes.TeamB.length +
        match?.attributes.TeamC.length +
        match?.attributes.TeamD.length ===
      6 * 4
    );
  };

  const isUserInMatch = () => {
    if (Me?.data) {
      return (
        match?.attributes.TeamA.some(
          player => player.Player?.data?.id === Me?.data?.id,
        ) ||
        match?.attributes.TeamB.some(
          player => player.Player?.data?.id === Me?.data?.id,
        ) ||
        match?.attributes.TeamC.some(
          player => player.Player?.data?.id === Me?.data?.id,
        ) ||
        match?.attributes.TeamD.some(
          player => player.Player?.data?.id === Me?.data?.id,
        )
      );
    }
    return false;
  };

  const isUserCaptainOfTeam = tn => {
    const this_team_ = tn?.split(' ').join('');
    if (Me?.data && this_team_) {
      return match?.attributes[`${this_team_}`].find(
        player => player.Player?.data?.id === Me?.data?.id && player.isCaptain,
      );
    }
    return false;
  };

  const TeamsAsArray = [
    {
      name: 'Team A',
      players: match?.attributes.TeamA,
      isCaptain:
        match?.attributes.TeamA.find(player => player.isCaptain) || false,
      isViceCaptain:
        match?.attributes.TeamA.find(player => player.isViceCaptain) || false,
    },
    {
      name: 'Team B',
      players: match?.attributes.TeamB,
      isCaptain:
        match?.attributes.TeamB.find(player => player.isCaptain) || false,
      isViceCaptain:
        match?.attributes.TeamB.find(player => player.isViceCaptain) || false,
    },
    {
      name: 'Team C',
      players: match?.attributes.TeamC,
      isCaptain:
        match?.attributes.TeamC.find(player => player.isCaptain) || false,
      isViceCaptain:
        match?.attributes.TeamC.find(player => player.isViceCaptain) || false,
    },
    {
      name: 'Team D',
      players: match?.attributes.TeamD,
      isCaptain:
        match?.attributes.TeamD.find(player => player.isCaptain) || false,
      isViceCaptain:
        match?.attributes.TeamD.find(player => player.isViceCaptain) || false,
    },
  ];

  const joinButtonText = () => {
    if (isPastEvent) {
      return 'Match Ended';
    } else if (isUserInMatch()) {
      return 'Leave Match';
    } else if (isFullPickup()) {
      return 'Join Waiting List';
    } else {
      return 'Join Match';
    }
  };

  const [confirmPickupIcon, setConfirmPickupIcon] =
    useStateIfMounted('checkmark');

  const [confirmPickupIconColor, setConfirmPickupIconColor] = useStateIfMounted(
    COLORS.lightGreen,
  );

  const [confirmPickupMessageBody, setConfirmPickupMessageBody] =
    useStateIfMounted('You have successfully joined the match');

  const ModalBody = () => {
    if (isUserInMatch()) {
      return (
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          <View style={{marginBottom: METRICS.spaceMedium}}>
            <CustomText
              style={[styles.fontSize.compact, styles.fontWeight.fw600]}>
              {joinButtonText()}
            </CustomText>

            <CustomText
              style={[styles.fontSize.normal, styles.fontWeight.fw600]}>
              {props.selectedMatch?.item?.attributes.Name}
            </CustomText>
          </View>

          <View style={{marginBottom: METRICS.spaceMedium}}>
            <CustomText
              style={[styles.fontSize.normal, styles.fontWeight.fw400]}>
              Are you sure you want to leave this match?
            </CustomText>
          </View>

          <View style={styles.buttonRow}>
            <Button
              content={'Leave'}
              disabled={loadingButton}
              loading={loadingButton}
              onPress={LeavePickupHandler}
              variant={'cancel'}
              size="normal"
              fullWidth={true}
            />
          </View>
        </View>
      );
    } else {
      if (inputCodeDialog) {
        return (
          <View>
            <View style={[{flex: 1}]}>
              <View>
                <CustomText
                  style={[
                    styles.fontSize.medium,
                    styles.fontWeight.fw600,
                    {marginBottom: METRICS.spaceSmall},
                  ]}>
                  {'Please Enter Code To Join '}
                </CustomText>
              </View>

              <View style={styles.buttonRow}>
                <Input
                  inputMode="numeric"
                  text={joiningCode}
                  placeholder="Enter Code"
                  onChange={onChangeJoiningCode}
                />
              </View>

              <Button
                content={'Join'}
                disabled={loadingButton}
                loading={loadingButton}
                onPress={checkCode}
                variant="solid"
                size="normal"
                fullWidth
              />
            </View>
          </View>
        );
      }
      if (pickupInviteType) {
        return (
          <View>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <View style={{marginBottom: METRICS.spaceMedium}}>
                <CustomText
                  style={[styles.fontSize.compact, styles.fontWeight.fw600]}>
                  Invite your team?
                </CustomText>
              </View>

              <View style={{marginBottom: METRICS.spaceMedium}}>
                <CustomText
                  style={[styles.fontSize.normal, styles.fontWeight.fw400]}>
                  Would you prefer to invite your team to join or keep the
                  registration open to the public?
                </CustomText>
              </View>

              <View>
                <View style={styles.buttonFirstRow}>
                  <Button
                    content={'Invite Team'}
                    disabled={loadingButton}
                    loading={loadingButton}
                    onPress={() => JoinPickupHandler(false)}
                    variant="solid"
                    size="normal"
                    fullWidth={true}
                  />
                </View>
                <View style={styles.buttonRow}>
                  <Button
                    content={'Open to Public'}
                    disabled={loadingButton}
                    loading={loadingButton}
                    onPress={() => JoinPickupHandler(true)}
                    variant="solid"
                    size="normal"
                    fullWidth={true}
                  />
                </View>
              </View>
            </View>
          </View>
        );
      } else {
        return (
          <View>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <View style={{marginBottom: METRICS.spaceMedium}}>
                <CustomText
                  style={[
                    styles.fontWeight.fw600,
                    isFullPickup()
                      ? styles.fontSize.medium
                      : styles.fontSize.compact,
                  ]}>
                  Select Team {isFullPickup() && 'to join Waiting List'}
                </CustomText>
              </View>

              <View>
                {TeamsAsArray?.map((team, index) => {
                  const teamEl = team;

                  return (
                    <View style={styles.buttonFirstRow} key={index}>
                      <Button
                        key={index}
                        content={teamEl?.name}
                        disabled={
                          match?.attributes[
                            `${teamEl?.name?.split(' ').join('')}Public`
                          ] && isFullPickup()
                        }
                        onPress={() => {
                          if (teamEl?.players?.length > 0) {
                            const this_team_ = teamEl?.name
                              ?.split(' ')
                              .join('');

                            if (Me?.data && this_team_) {
                              if (isFullPickup()) {
                                JoinPickupWaitingListHandler(teamEl?.name);
                                return;
                              }
                              if (match?.attributes[`${this_team_}Public`]) {
                                joinTeamImmediately(teamEl?.name);
                              } else {
                                enterCodeToJoinTeam(teamEl?.name);
                              }
                            }
                          } else {
                            setInviteToPickupModalVisibleHandler(teamEl?.name);
                          }
                        }}
                        variant="solid"
                        size="normal"
                        fullWidth={true}
                      />
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        );
      }
    }
  };

  const NestedModalBody = (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <View style={[{flex: 1, alignItems: 'center'}]}>
        <View
          style={[
            styles.modalConfirmIcon,
            {
              marginBottom: METRICS.spaceSmall,
              backgroundColor: confirmPickupIconColor,
            },
          ]}>
          <Icon name={confirmPickupIcon} size={100} color={COLORS.white} />
        </View>
        <CustomText
          style={[
            styles.fontSize.compact,
            styles.fontWeight.fw600,
            {textAlign: 'center', marginBottom: METRICS.spaceTiny},
          ]}>
          {confirmPickupMessageBody}
        </CustomText>

        <CustomText
          style={[
            styles.fontSize.medium,
            {textAlign: 'center', marginBottom: METRICS.spaceSmall},
          ]}>
          {teamUID && `Team code: ${teamUID}`}
        </CustomText>
        {/* 
        <CustomText
          style={[
            styles.fontSize.compact,
            styles.fontWeight.fw600,
            {
              textAlign: 'center',
              marginBottom: METRICS.spaceSmall,
              marginTop: METRICS.spaceLarge,
            },
          ]}>
          {`Invite your team`}
        </CustomText> */}

        <View
          style={[
            styles.rowContainer,
            styles.alignCenter,
            styles.justifyCenter,
            {marginBottom: METRICS.spaceLarge},
          ]}>
          {/* <TouchableOpacity
            style={[
              {marginRight: METRICS.spaceTiny},
              styles.alignCenter,
              styles.justifyCenter,
            ]}>
            <View style={[styles.iconCircle, styles.iconBackgroundWhatsapp]}>
              <Icon name="whatsapp" size={22} color={COLORS.white} />
            </View>
            <CustomText style={[styles.fontSize.tiny, {marginTop: 5}]}>
              Whatsapp
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {marginRight: METRICS.spaceTiny},
              styles.alignCenter,
              styles.justifyCenter,
            ]}>
            <LinearGradient
              colors={['#fccc63', '#fbad50', '#cd486b', '#8a3ab9']}
              start={{x: 0.0, y: 0.9}}
              end={{x: 0.5, y: 0.0}}
              style={styles.iconCircle}>
              <Icon name="instagram" size={25} color={COLORS.white} />
            </LinearGradient>
            <CustomText style={[styles.fontSize.tiny, {marginTop: 5}]}>
              Instagram
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {marginRight: METRICS.spaceTiny},
              styles.alignCenter,
              styles.justifyCenter,
            ]}>
            <View style={[styles.iconCircle, styles.iconBackgroundFacebook]}>
              <Icon name="facebook" size={18} color={COLORS.white} />
            </View>

            <CustomText style={[styles.fontSize.tiny, {marginTop: 5}]}>
              Instagram
            </CustomText>
          </TouchableOpacity> */}
          {/* <TouchableOpacity
            style={[
              {marginRight: METRICS.spaceTiny},
              styles.alignCenter,
              styles.justifyCenter,
            ]}>
            <View style={[styles.iconCircle]}>
              <Icon name="copy" size={18} color={COLORS.white} />
            </View>
            <CustomText style={[styles.fontSize.tiny, {marginTop: 5}]}>
              {teamUID ? 'Copy Code' : 'Copy Link'}
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[, styles.alignCenter, styles.justifyCenter]}>
            <View style={[styles.iconCircle]}>
              <Icon name="share" size={18} color={COLORS.white} />
            </View>
            <CustomText style={[styles.fontSize.tiny, {marginTop: 5}]}>
              {teamUID ? 'Share Code' : 'Copy Link'}
            </CustomText>
          </TouchableOpacity> */}
        </View>

        <Button
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

  const bottomButton = !displayPlayers && (
    <View
      style={[
        styles.container,
        styles.buttonRow,
        {position: 'absolute', bottom: 20, zIndex: 1},
      ]}>
      <Button
        content={joinButtonText()}
        disabled={isPastEvent}
        variant={isUserInMatch() && !isPastEvent ? 'cancel' : 'solid'}
        size="normal"
        fullWidth={true}
        onPress={() => {
          if (Me?.data) {
            setModalIsActive(!modalIsActive);
          } else {
            Alert.alert(
              'Sign In Required',
              'Please sign in or create an account to join a match',
              [
                {
                  text: 'Sign In',
                  onPress: () => {
                    navigation.navigate('LandingStack', {
                      screen: 'SignInScreen',
                    });
                  },
                },
                {
                  text: 'Cancel',
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

  const cancelAllModalsHandler = () => {
    setModalIsActive(!modalIsActive);
    setTimeout(() => {
      setNestedModalIsActive(!nestedModalIsActive);
      setPickupInviteType(false);
      setTeamName('');
      setTeamUID('');
      setInputCodeDialog(false);
      setJoiningCode('');
    }, 500);

    dispatch(fetchRegisteredPlayersOfPickup(countryCode, pickupID));
  };

  return (
    <HeroContainer
      title={match?.attributes.Name}
      onPressBack={onPressBack}
      bottomButton={bottomButton}
      modalIsActive={modalIsActive}
      setModalIsActive={() => {
        setModalIsActive(!modalIsActive);
        setTimeout(() => {
          setInputCodeDialog(false);
          setDisplayPlayers(false);
        }, 500);
      }}
      modalBody={ModalBody()}
      nestedModalStyle={'fullWithEdge'}
      nestedModalIsActive={nestedModalIsActive}
      setNestedModalIsActive={() => cancelAllModalsHandler()}
      nestedModalBody={NestedModalBody}>
      <View style={[styles.container]}>
        <View style={displayPlayers ? {display: 'none'} : {display: 'flex'}}>
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
              <View style={styles.flex}>
                <CustomText style={[styles.fontSize.normal]}>
                  {match?.attributes.Name}
                </CustomText>
                <CustomText
                  style={[
                    styles.fontSize.small,
                    {marginBottom: METRICS.spaceXTiny},
                  ]}>
                  {moment(match?.attributes.StartDate)
                    .utcOffset(currentTimezone)
                    .format('dddd DD/MM/YY LT') +
                    ' - ' +
                    moment(match?.attributes.EndDate)
                      .utcOffset(currentTimezone)
                      .format('LT')}
                </CustomText>
                <CustomText
                  style={[
                    styles.fontSize.small,
                    {marginBottom: METRICS.spaceSmall},
                  ]}>
                  {match?.attributes?.Location?.data?.attributes.Name}
                </CustomText>
                <View style={[styles.rowContainer, styles.alignCenter]}>
                  {facilitiesIcons}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.modalRow}>
            <View style={[styles.rowContainer, styles.alignCenter]}>
              <Icon name="money" size={20} color={COLORS.white} />
              <CustomText
                style={[
                  styles.fontSize.normal,
                  {marginLeft: METRICS.spaceTiny},
                ]}>
                Price
              </CustomText>
            </View>
            <CustomText style={[styles.fontSize.normal]}>
              {match?.attributes.Price + ' ' + currency}
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
                Duration
              </CustomText>
            </View>
            <CustomText
              style={[
                styles.fontSize.normal,
              ]}>{`${pickupMinutesDiff} minutes (${pickupHoursDiff} hours)`}</CustomText>
          </View>

          <View style={styles.modalRow}>
            <View style={[styles.rowContainer, styles.alignCenter]}>
              <Icon name="calendar" size={20} color={COLORS.white} />
              <CustomText
                style={[
                  styles.fontSize.normal,
                  {marginLeft: METRICS.spaceTiny},
                ]}>
                Age
              </CustomText>
            </View>
            <CustomText
              style={[
                styles.fontSize.normal,
              ]}>{`${match?.attributes.MinAge}+`}</CustomText>
          </View>

          {match?.attributes?.Location?.data && (
            <View style={styles.modalRow}>
              <View style={[styles.rowContainer, styles.alignCenter]}>
                <Icon name="map-marker" size={20} color={COLORS.white} />
                <CustomText
                  style={[
                    styles.fontSize.normal,
                    {marginLeft: METRICS.spaceTiny},
                  ]}>
                  Direction
                </CustomText>
              </View>

              <TouchableOpacity
                style={{alignItems: 'flex-end'}}
                onPress={() =>
                  Linking.openURL(
                    match?.attributes?.Location?.data?.attributes.GoogleMapLink,
                  )
                }>
                <CustomText style={[styles.fontSize.normal]}>
                  {'View on Google Maps'}
                </CustomText>

                <CustomText style={[styles.fontSize.tiny]}>
                  {match?.attributes?.Location?.data?.attributes.Name}
                </CustomText>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.modalRowColumn}>
            <View
              style={[
                styles.rowContainer,
                styles.alignCenter,
                {marginBottom: METRICS.spaceSmall},
              ]}>
              <Icon name="users-alt" size={20} color={COLORS.white} />
              <CustomText
                style={[
                  styles.fontSize.normal,
                  {marginLeft: METRICS.spaceTiny},
                ]}>
                Teams
              </CustomText>
            </View>
            <View style={[styles.rowContainer, styles.justifyCenter]}>
              {TeamsAsArray?.map((team, index) => {
                if (team.players?.length === 0) {
                  return (
                    <View style={[styles.alignCenter]} key={index}>
                      <OpenSpot
                        size="normal"
                        style={{
                          marginHorizontal: METRICS.spaceTiny,
                          marginBottom: METRICS.spaceTiny,
                        }}
                      />
                      <CustomText
                        style={[styles.fontSize.small, styles.textCenter]}>
                        {team.name}
                      </CustomText>
                    </View>
                  );
                } else {
                  return (
                    <TouchableOpacity
                      style={[styles.alignCenter]}
                      key={index}
                      onPress={() => displayPlayersHandler(team)}>
                      <Avatar
                        img={
                          team.isCaptain
                            ? team.isCaptain.Player?.data?.attributes.Image.data
                              ? `${rootURL}${team.isCaptain.Player?.data?.attributes.Image.data.attributes.url}`
                              : null
                            : team.isViceCaptain.Player?.data?.attributes.Image
                                .data
                            ? `${rootURL}${team.isViceCaptain.Player?.data?.attributes.Image.data.attributes.url}`
                            : null
                        }
                        name={
                          team.isCaptain
                            ? team.isCaptain.Player?.data?.attributes
                                .FirstName +
                              ' ' +
                              team.isCaptain.Player?.data?.attributes.LastName
                            : team.isViceCaptain.Player?.data?.attributes
                                .FirstName +
                              ' ' +
                              team.isViceCaptain.Player?.data?.attributes
                                .LastName
                        }
                        size="normal"
                        isCaptain={team.isCaptain.isCaptain}
                        isViceCaptain={
                          !team.isCaptain.isCaptain &&
                          team.isViceCaptain.isViceCaptain
                        }
                        style={{
                          marginHorizontal: METRICS.spaceTiny,
                          marginBottom: METRICS.spaceTiny,
                        }}
                      />
                      <CustomText
                        style={[styles.fontSize.small, styles.textCenter]}>
                        {team.name}
                      </CustomText>
                    </TouchableOpacity>
                  );
                }
              })}
            </View>
          </View>
        </View>
        <View style={displayPlayers ? {display: 'flex'} : {display: 'none'}}>
          <View style={styles.buttonFirstRow}>
            <TouchableOpacity
              style={[styles.rowContainer, styles.alignCenter]}
              onPress={() => {
                setDisplayPlayers(false);
                setTeamToDisplay(null);
              }}>
              <Icon name="angle-small-left" size={15} color={COLORS.white} />
              <CustomText style={{marginLeft: METRICS.spaceTiny}}>
                back to match details
              </CustomText>
            </TouchableOpacity>
          </View>

          {isUserCaptainOfTeam(teamToDisplay?.name) &&
            !match?.attributes[
              `${teamToDisplay?.name.split(' ').join('')}Public`
            ] && (
              <View style={styles.modalRow}>
                <CustomText
                  style={[
                    styles.fontSize.normal,
                  ]}>{`${teamToDisplay?.name} Code`}</CustomText>
                <CustomText style={[styles.fontSize.normal]}>
                  {
                    match?.attributes[
                      `${teamToDisplay?.name.split(' ').join('')}UID`
                    ]
                  }
                </CustomText>
              </View>
            )}

          <View style={styles.modalRow}>
            <CustomText
              style={[
                styles.fontSize.normal,
              ]}>{`${teamToDisplay?.name} Players`}</CustomText>
            <CustomText
              style={[
                styles.fontSize.normal,
              ]}>{`${teamToDisplay?.players.length}/6`}</CustomText>
          </View>

          {teamToDisplay?.players.length > 0 && (
            <View
              style={[
                Me?.data?.role?.type !== 'organizer' && styles.rowContainer,
                styles.justifyCenter,
                {flexWrap: 'wrap'},
              ]}>
              {teamToDisplay?.players.map((player, index) => {
                return (
                  <TouchableOpacity
                    disabled={Me?.data?.role?.type !== 'organizer'}
                    onPress={() => {
                      if (Me?.data?.role?.type === 'organizer') {
                        navigation.navigate('PlayersStack', {
                          screen: 'PlayerScreen',
                          params: {Player: player?.Player},
                        });
                      }
                    }}
                    style={
                      Me?.data?.role?.type === 'organizer'
                        ? [
                            styles.rowContainer,
                            styles.flex,
                            {
                              marginVertical: METRICS.spaceSmall,
                            },
                            styles.alignCenter,
                          ]
                        : [
                            {
                              width: METRICS.screenWidth / 4,
                              marginVertical: METRICS.spaceSmall,
                            },
                            styles.alignCenter,
                          ]
                    }
                    key={index}>
                    <Avatar
                      img={
                        player.Player?.data?.attributes.Image.data
                          ? `${rootURL}${player.Player?.data?.attributes.Image.data.attributes.url}`
                          : null
                      }
                      name={
                        player.Player?.data?.attributes.FirstName +
                        ' ' +
                        player.Player?.data?.attributes.LastName
                      }
                      isCaptain={player.isCaptain}
                      isViceCaptain={player.isViceCaptain}
                      size="normal"
                      style={{
                        marginHorizontal: METRICS.spaceTiny,
                        marginBottom: METRICS.spaceTiny,
                      }}
                    />
                    <View
                      style={
                        Me?.data?.role?.type === 'organizer' && styles.flex
                      }>
                      <CustomText
                        style={
                          Me?.data?.role?.type === 'organizer'
                            ? [styles.fontSize.small]
                            : [styles.fontSize.small, styles.textCenter]
                        }>
                        {player?.Player?.data?.attributes.FirstName +
                          ' ' +
                          player?.Player?.data?.attributes.LastName}
                      </CustomText>
                      {Me?.data?.role?.type === 'organizer' && (
                        <CustomText style={styles.fontSize.small}>
                          {`Age: ${player?.Player?.data?.attributes.Age}`}
                        </CustomText>
                      )}
                    </View>
                    {Me?.data?.role?.type === 'organizer' && (
                      <View style={[styles.rowContainer, styles.alignCenter]}>
                        <TouchableOpacity
                          style={[
                            styles.alignCenters,
                            {marginRight: METRICS.spaceTiny},
                          ]}
                          onPress={() => {
                            Linking.openURL(
                              `mailto:+${player?.Player?.data?.attributes.email}`,
                            );
                          }}>
                          <View
                            style={[
                              styles.iconCircle,
                              styles.iconBackgroundTikTok,
                            ]}>
                            <Icon name="at" size={18} color={COLORS.white} />
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.alignCenters]}
                          onPress={() => {
                            Linking.openURL(
                              `tel:+${player?.Player?.data?.attributes.Phone}`,
                            );
                          }}>
                          <View
                            style={[
                              styles.iconCircle,
                              styles.iconBackgroundCall,
                            ]}>
                            <Icon name="call" size={18} color={COLORS.white} />
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </HeroContainer>
  );
}

export default PickupScreen;
