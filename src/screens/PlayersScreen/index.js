import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import TabsContainer from '@containers/tabs_container';
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
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import CustomText from '@components/custom/custom_text';
import Icon from '@components/atoms/icon';

import Avatar from '@components/atoms/avatar';

import {useSelector, useDispatch} from 'react-redux';
import {getMe} from '@stores/selectors';

import {
  rootURL,
  LeaveMatch,
  TogglePaidMatch,
  TogglePaidTournament,
  MakeUserAbsent,
  AddTransaction,
  FetchMatch,
  FetchTournament,
  GetWalletByUserID,
  UpdatePlayerState,
} from '@config/functions';
import Input from '@components/atoms/input';

import {getCountry, getLanguage} from '@stores/selectors';

import {t} from 'i18next';
import HeroContainer from '@containers/hero_container';
import {fetchMatch, fetchTournament} from '@stores/services';

function PlayersScreen(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {matchID, matchType} = props.route.params;
  const [match, setMatch] = useState(null);
  const currentLang = useSelector(getLanguage);
  const currency =
    match?.attributes.Location?.data?.attributes.Country === 'JO'
      ? 'JOD'
      : 'QR';
  const countryCode = useSelector(getCountry);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const Me = useSelector(getMe);
  const [isShowingDetails, setIsShowingDetails] = useState(false);

  const fetchMatchHandler = async (refresh = true) => {
    setRefreshing(refresh);
    const response =
      matchType === 'match'
        ? await FetchMatch(countryCode, matchID)
        : await FetchTournament(countryCode, matchID);
    if (response) {
      setMatch(response);
      setRefreshing(false);

      return 200;
    }
  };
  useEffect(() => {
    fetchMatchHandler();
  }, []);

  const onPressBack = () => {
    Promise.all([
      navigation.goBack(),
      dispatch(
        matchType === 'match' ? fetchMatch(matchID) : fetchTournament(matchID),
      ),
    ]);
  };

  const getPriceWithDiscountForPaying = () => {
    if (!selectedPlayer) return;
    const this_players = match?.attributes?.Players;
    const selectedPlayerID = selectedPlayer?.details?.id;
    const this_selectedPlayer = this_players.filter(
      player => player.Player?.data?.id === selectedPlayerID,
    );
    const isGK = this_selectedPlayer.find(player => player.isGK);
    if (isGK?.isGK) {
      const originalPrice = match?.attributes?.Price;
      const discount = match?.attributes?.GKDiscount;

      if (originalPrice !== undefined && discount !== undefined) {
        return originalPrice - originalPrice * (discount / 100);
      } else {
        return originalPrice;
      }
    } else {
      return match?.attributes?.Price;
    }
  };

  const togglePaidHandler = async (
    player_id,
    cashAmount,
    walletAmount,
    returnAmount,
    onlineAmount,
    paidUsingCredit = false,
  ) => {
    setRemoveLoading(true);
    const res =
      matchType === 'match'
        ? await TogglePaidMatch(
            player_id,
            paidUsingCredit,
            cashAmount,
            walletAmount,
            returnAmount,
            onlineAmount,
            match.id,
            Me?.jwt,
          )
        : await TogglePaidTournament(
            player_id,
            paidUsingCredit,
            cashAmount,
            walletAmount,
            returnAmount,
            onlineAmount,
            match.id,
            Me?.jwt,
          );

    if (
      typeof res.data[currentLang] === 'string' &&
      res.data[currentLang].includes('error')
    ) {
      Alert.alert(
        t('matches:payment'),
        res.data[currentLang].split('error:')[1],
        [
          {
            text: t('common:tryAgain'),
            onPress: () => setRemoveLoading(false),
          },
        ],
      );
      return;
    }
    const fetched = fetchMatchHandler(false);
    fetched.then(data => {
      if (data === 200) {
        setRemoveLoading(false);
      }
    });
  };

  const unpayCash = async player_id => {
    setRemoveLoading(true);
    const res =
      matchType === 'match'
        ? await TogglePaidMatch(player_id, false, 0, 0, 0, 0, match.id, Me?.jwt)
        : await TogglePaidTournament(
            player_id,
            false,
            0,
            0,
            0,
            0,
            match.id,
            Me?.jwt,
          );

    if (
      typeof res.data[currentLang] === 'string' &&
      res.data[currentLang].includes('error')
    ) {
      Alert.alert(
        t('matches:payment'),
        res.data[currentLang].split('error:')[1],
        [
          {
            text: t('common:tryAgain'),
            onPress: () => setRemoveLoading(false),
          },
        ],
      );
      return;
    }
    const fetched = fetchMatchHandler(false);
    fetched.then(data => {
      if (data === 200) {
        setRemoveLoading(false);
      }
    });
  };

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [modalIsActive, setModalIsActive] = useState(false);

  const [selectedPlayerWallet, setSelectedPlayerWallet] = useState(null);

  const PayUsingWallet = async () => {
    setLoadingButton(true);
    const hasWalletResp = await GetWalletByUserID(
      selectedPlayer?.details?.id,
      Me?.jwt,
      countryCode,
    );

    if (!hasWalletResp?.data?.data?.length > 0) {
      Alert.alert(
        t('matches:walletNotFound'),
        `${t('matches:alertWalletNotFoundPt1')} ${
          selectedPlayer?.details?.attributes.FirstName
        } ${selectedPlayer?.details?.attributes.LastName} ${t(
          'matches:alertWalletNotFoundPt2',
        )}`,
        [
          {
            text: t('common:tryAgain'),
            onPress: () => {
              setLoadingButton(false);
            },
          },
        ],
      );
      return;
    }

    Alert.alert(
      t('matches:paymentConfirm'),
      `${t(
        'matches:alertPaymentConfirmPt1',
      )} ${getPriceWithDiscountForPaying()}${t(
        `common:${currency.toLowerCase()}`,
      )} ${t('matches:alertPaymentConfirmPt2')} ${
        selectedPlayer?.details?.attributes.FirstName
      } ${selectedPlayer?.details?.attributes.LastName}`,
      [
        {
          text: t('matches:yesConfirmButton'),
          onPress: async () => {
            const tranactionResp = await AddTransaction(
              hasWalletResp.data.data[0].id,
              Me?.data?.id,
              'Deduct',
              Number(getPriceWithDiscountForPaying()),
              matchID,
              matchType,
              Me?.jwt,
            );
            if (
              typeof tranactionResp.data[currentLang] === 'string' &&
              tranactionResp.data[currentLang].includes('error')
            ) {
              Alert.alert(
                t('matches:payment'),
                tranactionResp.data[currentLang].split('error:')[1],
                [
                  {
                    text: t('common:tryAgain'),
                    onPress: () => {
                      setLoadingButton(false);
                    },
                  },
                ],
              );
              return;
            }

            if (tranactionResp.data === 200) {
            }
            setLoadingButton(false);
            setModalIsActive(false);
            togglePaidHandler(
              selectedPlayer?.details?.id,
              0,
              Number(getPriceWithDiscountForPaying()),
              0,
              0,
              true,
            );
          },
        },
        {
          text: t('common:cancel'),
          onPress: () => {
            setLoadingButton(false);
          },
        },
      ],
    );
  };

  const PayCash = () => {
    setModalIsActive(false);
    togglePaidHandler(
      selectedPlayer?.details?.id,
      selectedPlayer?.isGK
        ? Number(getPriceWithDiscountForPaying())
        : Number(match?.attributes?.Price),
      0,
      0,
      0,
    );
  };

  const PayOnline = () => {
    setModalIsActive(false);
    togglePaidHandler(
      selectedPlayer?.details?.id,
      0,
      0,
      0,
      selectedPlayer?.isGK
        ? Number(getPriceWithDiscountForPaying())
        : Number(match?.attributes?.Price),
    );
  };

  const CashToWalletHandler = async () => {
    setLoadingButton(true);
    const hasWalletResp = await GetWalletByUserID(
      selectedPlayer?.details?.id,
      Me?.jwt,
      countryCode,
    );

    if (!hasWalletResp?.data?.data?.length > 0) {
      Alert.alert(
        t('matches:walletNotFound'),
        `${t('matches:alertWalletNotFoundPt1')} ${
          selectedPlayer?.details?.attributes.FirstName
        } ${selectedPlayer?.details?.attributes.LastName} ${t(
          'matches:alertWalletNotFoundPt2',
        )}`,
        [
          {
            text: t('common:tryAgain'),
            onPress: () => {
              setLoadingButton(false);
            },
          },
        ],
      );
      return;
    }

    setExchangeModal(true);
    setLoadingButton(false);
  };

  const [exchangeModal, setExchangeModal] = useState(false);

  const DetailsModal = (
    <View>
      <View style={styles.modalRow}>
        <View
          style={[styles.rowContainer, styles.alignCenter, {marginRight: 50}]}>
          <CustomText
            style={[
              styles.fontSize.normal,
              styles.fontWeight.fw600,
              {marginLeft: METRICS.spaceTiny},
            ]}>
            {t('matches:playerLabel')}
          </CustomText>
        </View>

        <View style={[styles.alignCenter, styles.rowContainer]}>
          <Avatar
            img={
              selectedPlayer?.Player?.data?.attributes?.Image?.data
                ? rootURL +
                  selectedPlayer?.Player?.data?.attributes?.Image?.data
                    .attributes.url
                : null
            }
            name={
              selectedPlayer?.Player?.data?.attributes?.FirstName +
              ' ' +
              selectedPlayer?.Player?.data?.attributes?.LastName
            }
            size={'small'}
          />
          <View style={[{marginLeft: METRICS.spaceTiny}]}>
            <CustomText style={[styles.fontSize.normal]}>
              {selectedPlayer?.Player?.data?.attributes?.FirstName +
                ' ' +
                selectedPlayer?.Player?.data?.attributes?.LastName}
            </CustomText>
          </View>
        </View>
      </View>

      <View style={styles.modalRow}>
        <View
          style={[styles.rowContainer, styles.alignCenter, {marginRight: 50}]}>
          <CustomText
            style={[
              styles.fontSize.normal,
              styles.fontWeight.fw600,
              {marginLeft: METRICS.spaceTiny},
            ]}>
            {t('matches:walletPaid')}
          </CustomText>
        </View>
        <CustomText style={[styles.fontSize.normal, styles.fontWeight.fw600]}>
          {`${selectedPlayer?.Wallet ? selectedPlayer?.Wallet : 0}${t(
            `common:${currency.toLowerCase()}`,
          )}`}
        </CustomText>
      </View>

      <View style={styles.modalRow}>
        <View
          style={[styles.rowContainer, styles.alignCenter, {marginRight: 50}]}>
          <CustomText
            style={[
              styles.fontSize.normal,
              styles.fontWeight.fw600,
              {marginLeft: METRICS.spaceTiny},
            ]}>
            {t('matches:cashPaid')}
          </CustomText>
        </View>
        <CustomText style={[styles.fontSize.normal, styles.fontWeight.fw600]}>
          {`${selectedPlayer?.Cash ? selectedPlayer?.Cash : 0}${t(
            `common:${currency.toLowerCase()}`,
          )}`}
        </CustomText>
      </View>

      <View style={[styles.modalRow, {marginBottom: METRICS.spaceSmall}]}>
        <View
          style={[styles.rowContainer, styles.alignCenter, {marginRight: 50}]}>
          <CustomText
            style={[
              styles.fontSize.normal,
              styles.fontWeight.fw600,
              {marginLeft: METRICS.spaceTiny},
            ]}>
            {t('matches:returnToWallet')}
          </CustomText>
        </View>
        <View style={[styles.rowContainer, styles.flex]}>
          <CustomText
            style={[
              styles.fontSize.normal,
              styles.fontWeight.fw600,
              {flex: 1, flexWrap: 'wrap', textAlign: 'right'},
            ]}>
            {`${selectedPlayer?.Return ? selectedPlayer?.Return : 0}${t(
              `common:${currency.toLowerCase()}`,
            )}`}
          </CustomText>
        </View>
      </View>
    </View>
  );
  const ModalBody = (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={{
            marginBottom: METRICS.spaceMedium,
          }}>
          <CustomText
            style={[styles.fontSize.compact, styles.fontWeight.fw600]}>
            {`${t('matches:payButton')} ${getPriceWithDiscountForPaying()} ${t(
              `common:${currency.toLowerCase()}`,
            )}`}
          </CustomText>

          <CustomText style={[styles.fontSize.normal, styles.fontWeight.fw600]}>
            {currentLang === 'ar'
              ? match?.attributes.NameAR
                ? match?.attributes.NameAR
                : match?.attributes.Name
              : match?.attributes.Name}
          </CustomText>
        </View>

        <View style={{display: exchangeModal ? 'none' : 'flex'}}>
          <View
            style={{
              marginBottom: METRICS.spaceMedium,
            }}>
            <CustomText
              style={[styles.fontSize.normal, styles.fontWeight.fw400]}>
              {t('matches:paymentConfirmDesc')}
            </CustomText>
          </View>
          <Button
            content={`${t('matches:walletLabel')} ${
              selectedPlayerWallet?.attributes?.Balance
                ? `(${selectedPlayerWallet?.attributes?.Balance})`
                : ''
            }`}
            disabled={loadingButton}
            loading={loadingButton}
            onPress={PayUsingWallet}
            variant={'adding'}
            size="normal"
            fullWidth
            style={{marginBottom: METRICS.spaceSmall}}
          />

          <Button
            content={t('matches:cashExchange')}
            disabled={loadingButton}
            loading={loadingButton}
            onPress={CashToWalletHandler}
            variant={'solid'}
            size="normal"
            fullWidth={true}
            style={{marginBottom: METRICS.spaceSmall}}
          />

          <Button
            content={t('matches:cashButton')}
            disabled={loadingButton}
            loading={loadingButton}
            onPress={PayCash}
            variant={'solid'}
            size="normal"
            fullWidth={true}
            style={{marginBottom: METRICS.spaceSmall}}
          />

          <Button
            content={t('matches:onlineButton')}
            disabled={loadingButton}
            loading={loadingButton}
            onPress={PayOnline}
            variant={'solid'}
            size="normal"
            fullWidth={true}
          />
        </View>

        <View style={{display: exchangeModal ? 'flex' : 'none'}}>
          <View>
            <CustomText
              style={[
                styles.fontSize.compact,
                styles.fontWeight.fw600,
                {marginBottom: METRICS.spaceSmall},
              ]}>
              {t('wallet:enterAmountLabel')}
            </CustomText>
          </View>

          <View style={{marginBottom: METRICS.spaceSmall}}>
            <Input
              text={cashAmount}
              inputMode={'decimal'}
              placeholder={t('wallet:cashPaidPlaceholder')}
              onChange={value => setCashAmount(value)}
            />
          </View>
          <Input
            text={amount}
            inputMode={'decimal'}
            placeholder={t('wallet:returnCashLabel')}
            onChange={value => setAmount(value)}
          />

          <View style={styles.buttonRow}>
            <Button
              content={t('matches:confirmLabel')}
              disabled={loadingButton}
              loading={loadingButton}
              variant="solid"
              size="normal"
              fullWidth
              onPress={() => sendAmountHandler()}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const [amount, setAmount] = useState(0);
  const [cashAmount, setCashAmount] = useState(0);
  const sendAmountHandler = async () => {
    setLoadingButton(true);

    if (!amount) {
      Alert.alert(t('wallet:enterAmountLabel'), t('wallet:alertEnterAmount'), [
        {
          text: t('common:tryAgain'),
          onPress: () => {
            setLoadingButton(false);
          },
        },
      ]);
      return;
    }

    if (amount < 1) {
      Alert.alert(
        t('wallet:enterAmountLabel'),
        t('wallet:alertBiggerThanZero'),
        [
          {
            text: t('common:tryAgain'),
            onPress: () => {
              setLoadingButton(false);
            },
          },
        ],
      );
      return;
    }

    if (!cashAmount) {
      Alert.alert(t('wallet:enterAmountLabel'), t('wallet:alertEnterAmount'), [
        {
          text: t('common:tryAgain'),
          onPress: () => {
            setLoadingButton(false);
          },
        },
      ]);
      return;
    }

    if (cashAmount < 1) {
      Alert.alert(
        t('wallet:enterAmountLabel'),
        t('wallet:alertBiggerThanZero'),
        [
          {
            text: t('common:tryAgain'),
            onPress: () => {
              setLoadingButton(false);
            },
          },
        ],
      );
      return;
    }

    const addTransactionResp = await AddTransaction(
      selectedPlayerWallet?.id,
      Me?.data?.id,
      'ReturnChange',
      amount,
      matchID,
      'match',
      Me?.jwt,
      cashAmount,
    );

    if (
      typeof addTransactionResp.data[currentLang] === 'string' &&
      addTransactionResp.data[currentLang].includes('error')
    ) {
      Alert.alert(
        t('matches:payment'),
        addTransactionResp.data[currentLang].split('error:')[1],
        [
          {
            text: t('common:tryAgain'),
            onPress: () => {
              setLoadingButton(false);
              sendAmountHandler();
            },
          },
        ],
      );
      return;
    }

    togglePaidHandler(
      selectedPlayer?.details?.id,
      cashAmount,
      0,
      amount,
      0,
      true,
    );

    setLoadingButton(false);
    setModalIsActive(false);
    setAmount(0);
    setCashAmount(0);
  };

  const GuestsRoute = (
    <View>
      {match?.attributes.Players?.length > 0 && (
        <View
          style={[
            styles.rowContainer,
            styles.justifyCenter,
            {flexWrap: 'wrap'},
          ]}>
          {match?.attributes.Players?.map((el, index) => {
            return (
              <View
                style={[
                  {
                    width: METRICS.screenWidth / 4,
                    marginVertical: METRICS.spaceSmall,
                  },
                  styles.alignCenter,
                ]}
                key={index}>
                <Avatar
                  img={
                    el?.Player?.data?.attributes.Image.data
                      ? `${rootURL}${el?.Player?.data?.attributes.Image.data.attributes.url}`
                      : null
                  }
                  name={
                    el?.Player?.data?.attributes.FirstName +
                    ' ' +
                    el?.Player?.data?.attributes.LastName
                  }
                  size="normal"
                  style={{
                    marginHorizontal: METRICS.spaceTiny,
                    marginBottom: METRICS.spaceTiny,
                  }}
                />

                <CustomText style={[styles.fontSize.small, styles.textCenter]}>
                  {el?.Player?.data?.attributes.FirstName +
                    ' ' +
                    el?.Player?.data?.attributes.LastName}
                </CustomText>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );

  const RosterRoute = (
    <View>
      {match?.attributes.Players?.length > 0 && (
        <View style={[styles.justifyCenter, {flexWrap: 'wrap'}]}>
          {match?.attributes.Players?.map((el, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('PlayersStack', {
                    screen: 'PlayerScreen',
                    params: {
                      Player: el?.Player,
                      matchID: match.id,
                      matchType,
                    },
                  });
                }}
                style={[
                  styles.rowContainer,
                  styles.flex,
                  {
                    marginVertical: METRICS.spaceSmall,
                  },
                  styles.alignCenter,
                ]}
                key={index}>
                <Avatar
                  img={
                    el?.Player?.data?.attributes.Image.data
                      ? `${rootURL}${el?.Player?.data?.attributes.Image.data.attributes.url}`
                      : null
                  }
                  name={
                    el?.Player?.data?.attributes.FirstName +
                    ' ' +
                    el?.Player?.data?.attributes.LastName
                  }
                  size="normal"
                  style={{
                    marginHorizontal: METRICS.spaceTiny,
                    marginBottom: METRICS.spaceTiny,
                  }}
                  isGK={el?.isGK}
                />

                <View style={[styles.flex]}>
                  <CustomText
                    style={[styles.fontSize.small, {textAlign: 'left'}]}>
                    {el?.Player?.data?.attributes.FirstName +
                      ' ' +
                      el?.Player?.data?.attributes.LastName}
                  </CustomText>
                  <CustomText
                    style={[styles.fontSize.small, {textAlign: 'left'}]}>
                    {`${t('matches:ageLabel')}: ${
                      el?.Player?.data?.attributes.Age
                    }`}
                  </CustomText>
                </View>

                <View style={[styles.rowContainer, styles.alignCenter]}>
                  <TouchableOpacity
                    style={[
                      styles.alignCenters,
                      {marginRight: METRICS.spaceTiny},
                    ]}
                    onPress={() => {
                      Linking.openURL(
                        `tel:+${el?.Player?.data?.attributes.Phone}`,
                      );
                    }}>
                    <View
                      style={[
                        styles.iconCircle,
                        styles.iconCircle.small,
                        styles.iconBackgroundCall,
                      ]}>
                      <Icon name="call" size={18} color={COLORS.white} />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={removeLoading}
                    style={[
                      styles.alignCenters,
                      {marginRight: METRICS.spaceTiny},
                    ]}
                    onPress={async () => {
                      setRemoveLoading(true);

                      const res = await MakeUserAbsent(
                        el?.Player?.data?.id,
                        Me?.jwt,
                        el?.Player?.data?.attributes?.AbsentLastMatch,
                      );

                      if (
                        typeof res.data[currentLang] === 'string' &&
                        res.data[currentLang].includes('error')
                      ) {
                        Alert.alert(
                          t('matches:alertUserAbsent'),
                          res.data[currentLang].split('error:')[1],
                          [
                            {
                              text: t('common:cancel'),
                              onPress: () => setRemoveLoading(false),
                            },
                          ],
                        );
                        return;
                      }
                      const fetched = fetchMatchHandler(false);
                      fetched.then(data => {
                        if (data === 200) {
                          setRemoveLoading(false);
                        }
                      });
                    }}>
                    <View
                      style={[
                        styles.iconCircle,
                        styles.iconCircle.small,
                        el?.Player?.data?.attributes.AbsentLastMatch
                          ? styles.iconBackgroundAbsent
                          : styles.iconBackgroundTikTok,
                      ]}>
                      <Icon name="question" size={18} color={COLORS.white} />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={removeLoading}
                    style={[
                      styles.alignCenters,
                      {marginRight: METRICS.spaceTiny},
                    ]}
                    onPress={() => {
                      setRemoveLoading(true);
                      Alert.alert(
                        t('matches:removePlayerLabel'),
                        `${t('matches:alertRemovePlayerPt1')} ${
                          el?.Player?.data?.attributes.FirstName +
                          ' ' +
                          el?.Player?.data?.attributes.LastName
                        }${t('matches:alertRemovePlayerPt2')}`,
                        [
                          {
                            text: t('matches:removeButton'),
                            style: 'cancel',
                            onPress: async () => {
                              const join_res = await LeaveMatch(
                                el?.Player?.data?.id,
                                match.id,
                                Me?.jwt,
                                Intl.DateTimeFormat().resolvedOptions()
                                  .timeZone,
                                false,
                              );

                              if (
                                typeof join_res.data[currentLang] ===
                                  'string' &&
                                join_res.data[currentLang].includes('error')
                              ) {
                                Alert.alert(
                                  t('matches:removePlayerLabel'),
                                  join_res.data[currentLang].split(':')[1],
                                  [
                                    {
                                      text: t('common:tryAgain'),
                                      onPress: () => setRemoveLoading(false),
                                    },
                                  ],
                                );
                                return;
                              }
                              const fetched = fetchMatchHandler(false);
                              fetched.then(data => {
                                if (data === 200) {
                                  setRemoveLoading(false);
                                }
                              });
                            },
                          },
                          {
                            text: t('common:cancel'),
                            onPress: () => setRemoveLoading(false),
                          },
                        ],
                      );
                    }}>
                    <View
                      style={[
                        styles.iconCircle,
                        styles.iconCircle.small,
                        styles.iconBackgroundRemove,
                      ]}>
                      <Icon name="trash-xmark" size={18} color={COLORS.white} />
                    </View>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );

  const PayRoute = (
    <View>
      {match?.attributes.Players?.length > 0 && (
        <View style={[styles.justifyCenter, {flexWrap: 'wrap'}]}>
          {match?.attributes.Players?.map((el, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('PlayersStack', {
                    screen: 'PlayerScreen',
                    params: {
                      Player: el?.Player,
                      matchID: match.id,
                      matchType,
                    },
                  });
                }}
                style={[
                  styles.rowContainer,
                  styles.flex,
                  {
                    marginVertical: METRICS.spaceSmall,
                  },
                  styles.alignCenter,
                ]}
                key={index}>
                <Avatar
                  img={
                    el?.Player?.data?.attributes.Image.data
                      ? `${rootURL}${el?.Player?.data?.attributes.Image.data.attributes.url}`
                      : null
                  }
                  name={
                    el?.Player?.data?.attributes.FirstName +
                    ' ' +
                    el?.Player?.data?.attributes.LastName
                  }
                  size="normal"
                  style={{
                    marginHorizontal: METRICS.spaceTiny,
                    marginBottom: METRICS.spaceTiny,
                  }}
                  isGK={el?.isGK}
                />
                <View style={[styles.flex]}>
                  <CustomText
                    style={[styles.fontSize.small, {textAlign: 'left'}]}>
                    {el?.Player?.data?.attributes.FirstName +
                      ' ' +
                      el?.Player?.data?.attributes.LastName}
                  </CustomText>
                  <CustomText
                    style={[styles.fontSize.small, {textAlign: 'left'}]}>
                    {`${t('matches:ageLabel')}: ${
                      el?.Player?.data?.attributes.Age
                    }`}
                  </CustomText>
                </View>
                <View style={[styles.rowContainer, styles.alignCenter]}>
                  {el?.Paid && (
                    <Button
                      content={t('matches:detailsButton')}
                      disabled={removeLoading}
                      loading={removeLoading}
                      variant={'solid'}
                      onPress={() => {
                        setModalIsActive(true);
                        setIsShowingDetails(true);
                        setSelectedPlayer(el);
                      }}
                      size="compact"
                      style={{marginRight: METRICS.spaceTiny}}
                    />
                  )}
                  <Button
                    content={
                      el?.Paid
                        ? t('matches:revokeButton')
                        : t('matches:chargeButton')
                    }
                    disabled={removeLoading}
                    loading={removeLoading}
                    onPress={async () => {
                      if (!el.Paid) {
                        setModalIsActive(true);
                        setSelectedPlayer({
                          details: el?.Player?.data,
                          isGK: el?.isGK,
                        });
                        const hasWalletResp = await GetWalletByUserID(
                          el?.Player?.data?.id,
                          Me?.jwt,
                          countryCode,
                        );
                        if (hasWalletResp?.data?.data?.length > 0) {
                          setSelectedPlayerWallet(hasWalletResp.data.data[0]);
                        } else {
                          setSelectedPlayerWallet(null);
                        }
                        return;
                      }
                      if (el.isPaidUsingCredit) {
                        Alert.alert(
                          t('matches:alertUndoPaymentTitle'),
                          `${el?.Player?.data?.attributes?.FirstName} ${
                            el?.Player?.data?.attributes?.LastName
                          } ${t('matches:alertUndoPaymentDesc')}`,
                        );
                        return;
                      }

                      unpayCash(el?.Player?.data?.id);
                    }}
                    variant={el?.Paid ? 'cancel' : 'adding'}
                    size="compact"
                    style={{marginRight: METRICS.spaceTiny}}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );

  const CardIcon = ({color}) => {
    return <View style={[styles.refCard, styles.refCardColor[color]]} />;
  };

  const UpdatePlayerStateHandler = async (this_player, type) => {
    setLoadingButton(true);
    try {
      setSelectedPlayer(this_player);

      const statsObj = {
        redCards: this_player?.redCards,
        yellowCards: this_player?.yellowCards,
        goals: this_player?.goals,
        assists: this_player?.assists,
        motm: this_player?.motm ?? false,
      };

      switch (type) {
        case 'AddRed':
          statsObj.redCards = (statsObj.redCards || 0) + 1;
          break;
        case 'DeductRed':
          statsObj.redCards = Math.max((statsObj.redCards || 0) - 1, 0);
          break;
        case 'AddYellow':
          statsObj.yellowCards = (statsObj.yellowCards || 0) + 1;
          break;
        case 'DeductYellow':
          statsObj.yellowCards = Math.max((statsObj.yellowCards || 0) - 1, 0);
          break;
        case 'AddGoal':
          statsObj.goals = (statsObj.goals || 0) + 1;
          break;
        case 'DeductGoal':
          statsObj.goals = Math.max((statsObj.goals || 0) - 1, 0);
          break;
        case 'AddAssist':
          statsObj.assists = (statsObj.assists || 0) + 1;
          break;
        case 'DeductAssist':
          statsObj.assists = Math.max((statsObj.assists || 0) - 1, 0);
          break;
        case 'ToggleMOTM':
          statsObj.motm = !statsObj.motm;
          break;
        default:
          // Handle unknown type or do nothing
          break;
      }

      const response = await UpdatePlayerState(
        matchID,
        this_player?.Player?.data?.id,
        statsObj,
        Me?.jwt,
      );

      if (response.status === 200) {
        fetchMatchHandler();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const RedCardsRoute = (
    <View>
      {match?.attributes.Players?.length > 0 && (
        <View style={[styles.justifyCenter, {flexWrap: 'wrap'}]}>
          {match?.attributes.Players?.map((el, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('PlayersStack', {
                    screen: 'PlayerScreen',
                    params: {
                      Player: el?.Player,
                      matchID: match.id,
                      matchType,
                    },
                  });
                }}
                style={[
                  styles.rowContainer,
                  styles.flex,
                  {
                    marginVertical: METRICS.spaceSmall,
                  },
                  styles.alignCenter,
                ]}
                key={index}>
                <Avatar
                  img={
                    el?.Player?.data?.attributes.Image.data
                      ? `${rootURL}${el?.Player?.data?.attributes.Image.data.attributes.url}`
                      : null
                  }
                  name={
                    el?.Player?.data?.attributes.FirstName +
                    ' ' +
                    el?.Player?.data?.attributes.LastName
                  }
                  size="normal"
                  style={{
                    marginHorizontal: METRICS.spaceTiny,
                    marginBottom: METRICS.spaceTiny,
                  }}
                  isGK={el?.isGK}
                />

                <View style={[styles.flex]}>
                  <CustomText
                    style={[styles.fontSize.small, {textAlign: 'left'}]}>
                    {el?.Player?.data?.attributes.FirstName +
                      ' ' +
                      el?.Player?.data?.attributes.LastName}
                  </CustomText>
                  <CustomText
                    style={[styles.fontSize.small, {textAlign: 'left'}]}>
                    {`${t('matches:ageLabel')}: ${
                      el?.Player?.data?.attributes.Age
                    }`}
                  </CustomText>
                </View>

                <View style={[styles.rowContainer, styles.alignCenter]}>
                  <TouchableOpacity
                    style={[styles.alignCenters]}
                    disabled={loadingButton || refreshing}
                    onPress={() => {
                      new Promise(function (resolve, reject) {
                        resolve(UpdatePlayerStateHandler(el, 'DeductRed'));
                      }).then(function () {
                        setLoadingButton(false);
                        setSelectedPlayer(-1);
                      });
                    }}>
                    <View
                      style={[
                        styles.iconCircle,
                        styles.iconCircle.small,
                        styles.iconBackgroundTikTok,
                      ]}>
                      <Icon name="minus-small" size={18} color={COLORS.white} />
                    </View>
                  </TouchableOpacity>

                  {el?.Player?.data?.id === selectedPlayer?.Player?.data?.id &&
                  loadingButton ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <CustomText style={{marginHorizontal: METRICS.spaceTiny}}>
                      {el?.redCards ?? 0}
                    </CustomText>
                  )}

                  <TouchableOpacity
                    disabled={loadingButton || refreshing}
                    onPress={() => {
                      new Promise(function (resolve, reject) {
                        resolve(UpdatePlayerStateHandler(el, 'AddRed'));
                      }).then(function () {
                        setLoadingButton(false);
                        setSelectedPlayer(-1);
                      });
                    }}
                    style={[styles.alignCenters]}>
                    <View
                      style={[
                        styles.iconCircle,
                        styles.iconCircle.small,
                        styles.iconBackgroundTikTok,
                      ]}>
                      <Icon name="plus-small" size={18} color={COLORS.white} />
                    </View>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );

  const YellowCardsRoute = (
    <View>
      {match?.attributes.Players?.length > 0 && (
        <View style={[styles.justifyCenter, {flexWrap: 'wrap'}]}>
          {match?.attributes.Players?.map((el, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('PlayersStack', {
                    screen: 'PlayerScreen',
                    params: {
                      Player: el?.Player,
                      matchID: match.id,
                      matchType,
                    },
                  });
                }}
                style={[
                  styles.rowContainer,
                  styles.flex,
                  {
                    marginVertical: METRICS.spaceSmall,
                  },
                  styles.alignCenter,
                ]}
                key={index}>
                <Avatar
                  img={
                    el?.Player?.data?.attributes.Image.data
                      ? `${rootURL}${el?.Player?.data?.attributes.Image.data.attributes.url}`
                      : null
                  }
                  name={
                    el?.Player?.data?.attributes.FirstName +
                    ' ' +
                    el?.Player?.data?.attributes.LastName
                  }
                  size="normal"
                  style={{
                    marginHorizontal: METRICS.spaceTiny,
                    marginBottom: METRICS.spaceTiny,
                  }}
                  isGK={el?.isGK}
                />

                <View style={[styles.flex]}>
                  <CustomText
                    style={[styles.fontSize.small, {textAlign: 'left'}]}>
                    {el?.Player?.data?.attributes.FirstName +
                      ' ' +
                      el?.Player?.data?.attributes.LastName}
                  </CustomText>
                  <CustomText
                    style={[styles.fontSize.small, {textAlign: 'left'}]}>
                    {`${t('matches:ageLabel')}: ${
                      el?.Player?.data?.attributes.Age
                    }`}
                  </CustomText>
                </View>

                <View style={[styles.rowContainer, styles.alignCenter]}>
                  <TouchableOpacity
                    style={[styles.alignCenters]}
                    disabled={loadingButton || refreshing}
                    onPress={() => {
                      new Promise(function (resolve, reject) {
                        resolve(UpdatePlayerStateHandler(el, 'DeductYellow'));
                      }).then(function () {
                        setLoadingButton(false);
                        setSelectedPlayer(-1);
                      });
                    }}>
                    <View
                      style={[
                        styles.iconCircle,
                        styles.iconCircle.small,
                        styles.iconBackgroundTikTok,
                      ]}>
                      <Icon name="minus-small" size={18} color={COLORS.white} />
                    </View>
                  </TouchableOpacity>

                  {el?.Player?.data?.id === selectedPlayer?.Player?.data?.id &&
                  loadingButton ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <CustomText style={{marginHorizontal: METRICS.spaceTiny}}>
                      {el?.yellowCards ?? 0}
                    </CustomText>
                  )}

                  <TouchableOpacity
                    style={[styles.alignCenters]}
                    disabled={loadingButton || refreshing}
                    onPress={() => {
                      new Promise(function (resolve, reject) {
                        resolve(UpdatePlayerStateHandler(el, 'AddYellow'));
                      }).then(function () {
                        setLoadingButton(false);
                        setSelectedPlayer(-1);
                      });
                    }}>
                    <View
                      style={[
                        styles.iconCircle,
                        styles.iconCircle.small,
                        styles.iconBackgroundTikTok,
                      ]}>
                      <Icon name="plus-small" size={18} color={COLORS.white} />
                    </View>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );

  const GoalsRoute = (
    <View>
      {match?.attributes.Players?.length > 0 && (
        <View style={[styles.justifyCenter, {flexWrap: 'wrap'}]}>
          {match?.attributes.Players?.map((el, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('PlayersStack', {
                    screen: 'PlayerScreen',
                    params: {
                      Player: el?.Player,
                      matchID: match.id,
                      matchType,
                    },
                  });
                }}
                style={[
                  styles.rowContainer,
                  styles.flex,
                  {
                    marginVertical: METRICS.spaceSmall,
                  },
                  styles.alignCenter,
                ]}
                key={index}>
                <Avatar
                  img={
                    el?.Player?.data?.attributes.Image.data
                      ? `${rootURL}${el?.Player?.data?.attributes.Image.data.attributes.url}`
                      : null
                  }
                  name={
                    el?.Player?.data?.attributes.FirstName +
                    ' ' +
                    el?.Player?.data?.attributes.LastName
                  }
                  size="normal"
                  style={{
                    marginHorizontal: METRICS.spaceTiny,
                    marginBottom: METRICS.spaceTiny,
                  }}
                  isGK={el?.isGK}
                />

                <View style={[styles.flex]}>
                  <CustomText
                    style={[styles.fontSize.small, {textAlign: 'left'}]}>
                    {el?.Player?.data?.attributes.FirstName +
                      ' ' +
                      el?.Player?.data?.attributes.LastName}
                  </CustomText>
                  <CustomText
                    style={[styles.fontSize.small, {textAlign: 'left'}]}>
                    {`${t('matches:ageLabel')}: ${
                      el?.Player?.data?.attributes.Age
                    }`}
                  </CustomText>
                </View>

                <View style={[styles.rowContainer, styles.alignCenter]}>
                  <TouchableOpacity
                    style={[styles.alignCenters]}
                    disabled={loadingButton || refreshing}
                    onPress={() => {
                      new Promise(function (resolve, reject) {
                        resolve(UpdatePlayerStateHandler(el, 'DeductGoal'));
                      }).then(function () {
                        setLoadingButton(false);
                        setSelectedPlayer(-1);
                      });
                    }}>
                    <View
                      style={[
                        styles.iconCircle,
                        styles.iconCircle.small,
                        styles.iconBackgroundTikTok,
                      ]}>
                      <Icon name="minus-small" size={18} color={COLORS.white} />
                    </View>
                  </TouchableOpacity>

                  {el?.Player?.data?.id === selectedPlayer?.Player?.data?.id &&
                  loadingButton ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <CustomText style={{marginHorizontal: METRICS.spaceTiny}}>
                      {el?.goals ?? 0}
                    </CustomText>
                  )}

                  <TouchableOpacity
                    style={[styles.alignCenters]}
                    disabled={loadingButton || refreshing}
                    onPress={() => {
                      new Promise(function (resolve, reject) {
                        resolve(UpdatePlayerStateHandler(el, 'AddGoal'));
                      }).then(function () {
                        setLoadingButton(false);
                        setSelectedPlayer(-1);
                      });
                    }}>
                    <View
                      style={[
                        styles.iconCircle,
                        styles.iconCircle.small,
                        styles.iconBackgroundTikTok,
                      ]}>
                      <Icon name="plus-small" size={18} color={COLORS.white} />
                    </View>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );

  const AssistsRoute = (
    <View>
      {match?.attributes.Players?.length > 0 && (
        <View style={[styles.justifyCenter, {flexWrap: 'wrap'}]}>
          {match?.attributes.Players?.map((el, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('PlayersStack', {
                    screen: 'PlayerScreen',
                    params: {
                      Player: el?.Player,
                      matchID: match.id,
                      matchType,
                    },
                  });
                }}
                style={[
                  styles.rowContainer,
                  styles.flex,
                  {
                    marginVertical: METRICS.spaceSmall,
                  },
                  styles.alignCenter,
                ]}
                key={index}>
                <Avatar
                  img={
                    el?.Player?.data?.attributes.Image.data
                      ? `${rootURL}${el?.Player?.data?.attributes.Image.data.attributes.url}`
                      : null
                  }
                  name={
                    el?.Player?.data?.attributes.FirstName +
                    ' ' +
                    el?.Player?.data?.attributes.LastName
                  }
                  size="normal"
                  style={{
                    marginHorizontal: METRICS.spaceTiny,
                    marginBottom: METRICS.spaceTiny,
                  }}
                  isGK={el?.isGK}
                />

                <View style={[styles.flex]}>
                  <CustomText
                    style={[styles.fontSize.small, {textAlign: 'left'}]}>
                    {el?.Player?.data?.attributes.FirstName +
                      ' ' +
                      el?.Player?.data?.attributes.LastName}
                  </CustomText>
                  <CustomText
                    style={[styles.fontSize.small, {textAlign: 'left'}]}>
                    {`${t('matches:ageLabel')}: ${
                      el?.Player?.data?.attributes.Age
                    }`}
                  </CustomText>
                </View>

                <View style={[styles.rowContainer, styles.alignCenter]}>
                  <TouchableOpacity
                    style={[styles.alignCenters]}
                    disabled={loadingButton || refreshing}
                    onPress={() => {
                      new Promise(function (resolve, reject) {
                        resolve(UpdatePlayerStateHandler(el, 'DeductAssist'));
                      }).then(function () {
                        setLoadingButton(false);
                        setSelectedPlayer(-1);
                      });
                    }}>
                    <View
                      style={[
                        styles.iconCircle,
                        styles.iconCircle.small,
                        styles.iconBackgroundTikTok,
                      ]}>
                      <Icon name="minus-small" size={18} color={COLORS.white} />
                    </View>
                  </TouchableOpacity>

                  {el?.Player?.data?.id === selectedPlayer?.Player?.data?.id &&
                  loadingButton ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <CustomText style={{marginHorizontal: METRICS.spaceTiny}}>
                      {el?.assists ?? 0}
                    </CustomText>
                  )}

                  <TouchableOpacity
                    style={[styles.alignCenters]}
                    onPress={() => {
                      new Promise(function (resolve, reject) {
                        resolve(UpdatePlayerStateHandler(el, 'AddAssist'));
                      }).then(function () {
                        setLoadingButton(false);
                        setSelectedPlayer(-1);
                      });
                    }}>
                    <View
                      style={[
                        styles.iconCircle,
                        styles.iconCircle.small,
                        styles.iconBackgroundTikTok,
                      ]}>
                      <Icon name="plus-small" size={18} color={COLORS.white} />
                    </View>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );

  const MOTMRoute = (
    <View>
      {match?.attributes.Players?.length > 0 && (
        <View style={[styles.justifyCenter, {flexWrap: 'wrap'}]}>
          {match?.attributes.Players?.map((el, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('PlayersStack', {
                    screen: 'PlayerScreen',
                    params: {
                      Player: el?.Player,
                      matchID: match.id,
                      matchType,
                    },
                  });
                }}
                style={[
                  styles.rowContainer,
                  styles.flex,
                  {
                    marginVertical: METRICS.spaceSmall,
                  },
                  styles.alignCenter,
                ]}
                key={index}>
                <Avatar
                  img={
                    el?.Player?.data?.attributes.Image.data
                      ? `${rootURL}${el?.Player?.data?.attributes.Image.data.attributes.url}`
                      : null
                  }
                  name={
                    el?.Player?.data?.attributes.FirstName +
                    ' ' +
                    el?.Player?.data?.attributes.LastName
                  }
                  size="normal"
                  style={{
                    marginHorizontal: METRICS.spaceTiny,
                    marginBottom: METRICS.spaceTiny,
                  }}
                  isGK={el?.isGK}
                />

                <View style={[styles.flex]}>
                  <CustomText
                    style={[styles.fontSize.small, {textAlign: 'left'}]}>
                    {el?.Player?.data?.attributes.FirstName +
                      ' ' +
                      el?.Player?.data?.attributes.LastName}
                  </CustomText>
                  <CustomText
                    style={[styles.fontSize.small, {textAlign: 'left'}]}>
                    {`${t('matches:ageLabel')}: ${
                      el?.Player?.data?.attributes.Age
                    }`}
                  </CustomText>
                </View>

                <View style={[styles.rowContainer, styles.alignCenter]}>
                  <TouchableOpacity
                    style={[styles.alignCenters]}
                    onPress={() => {
                      new Promise(function (resolve, reject) {
                        resolve(UpdatePlayerStateHandler(el, 'ToggleMOTM'));
                      }).then(function () {
                        setLoadingButton(false);
                        setSelectedPlayer(-1);
                      });
                    }}>
                    <View
                      style={[
                        styles.iconCircle,
                        styles.iconCircle.small,
                        styles.iconBackgroundTikTok,
                        el?.motm && {
                          backgroundColor: COLORS.backgroundYellowTransparent,
                        },
                      ]}>
                      {el?.Player?.data?.id ===
                        selectedPlayer?.Player?.data?.id && loadingButton ? (
                        <ActivityIndicator size="small" color={COLORS.white} />
                      ) : (
                        <Icon
                          name="star"
                          size={15}
                          color={
                            el?.motm ? COLORS.backgroundYellow : COLORS.white
                          }
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );

  const renderScenesOrg = [
    {
      title: t('matches:rosterTabLabel'),
      type: 'text',
      body: RosterRoute,
    },
    {
      title: t('matches:paymentTabLabel'),
      type: 'text',
      body: PayRoute,
    },
  ];

  const renderScenesRef = [
    {
      title: (
        <View style={[styles.alignCenter, styles.statsItem]}>
          <CardIcon color="red" />

          <CustomText
            style={[styles.fontSize.small, {marginTop: METRICS.spaceTiny}]}>
            {t('profile:redCardsLabel')}
          </CustomText>
        </View>
      ),
      type: 'icon',
      body: RedCardsRoute,
    },
    {
      title: (
        <View style={[styles.alignCenter, styles.statsItem]}>
          <CardIcon color="yellow" />

          <CustomText
            style={[styles.fontSize.small, {marginTop: METRICS.spaceTiny}]}>
            {t('profile:yellowCardsLabel')}
          </CustomText>
        </View>
      ),
      type: 'icon',
      body: YellowCardsRoute,
    },
    {
      title: (
        <View style={[styles.alignCenter, styles.statsItem]}>
          <Icon name="football" size={22} color={COLORS.white} />
          <CustomText
            style={[styles.fontSize.small, {marginTop: METRICS.spaceTiny}]}>
            {t('profile:goalsLabel')}
          </CustomText>
        </View>
      ),
      type: 'icon',
      body: GoalsRoute,
    },
    {
      title: (
        <View style={[styles.alignCenter, styles.statsItem]}>
          <Icon name="handshake" size={22} color={COLORS.white} />

          <CustomText
            style={[styles.fontSize.small, {marginTop: METRICS.spaceTiny}]}>
            {t('profile:assistsLabel')}
          </CustomText>
        </View>
      ),
      type: 'icon',
      body: AssistsRoute,
    },
    {
      title: (
        <View style={[styles.alignCenter, styles.statsItem]}>
          <Icon name="medal" size={22} color={COLORS.white} />
          <CustomText
            style={[styles.fontSize.small, {marginTop: METRICS.spaceTiny}]}>
            {t('profile:motmLabel')}
          </CustomText>
        </View>
      ),
      type: 'icon',
      body: MOTMRoute,
    },
  ];

  // for ref
  const [currentScene, setCurrentScene] = useState(400);
  const headerRightHandler = () => {
    if (currentScene === 401) {
      return (
        <TouchableOpacity
          onPress={() => {
            setCurrentScene(400);
          }}>
          <CardIcon color="red" />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => {
            setCurrentScene(401);
          }}>
          <Icon name="formation" size={25} color={COLORS.white} />
        </TouchableOpacity>
      );
    }
  };

  if (Me?.data?.role?.type === 'organizer') {
    return (
      <TabsContainer
        title={
          refreshing && !match ? (
            <ActivityIndicator size="large" color={COLORS.white} />
          ) : (
            `${t('matches:playersLabel')} (${
              match?.attributes.Players?.length
            }/${match?.attributes.Capacity})`
          )
        }
        onPressBack={onPressBack}
        renderScene={renderScenesOrg}
        modalIsActive={modalIsActive}
        setModalIsActive={() => {
          setModalIsActive(!modalIsActive);
          setTimeout(() => {
            setSelectedPlayerWallet(null);
            setIsShowingDetails(false);
            setExchangeModal(false);
          }, 500);
        }}
        modalStyle={isShowingDetails && 'halfWithEdge'}
        modalBody={isShowingDetails ? DetailsModal : ModalBody}
        refreshHandler={fetchMatchHandler}
        refreshing={refreshing}
      />
    );
  } else if (Me?.data?.role?.type === 'referee') {
    return (
      <TabsContainer
        title={
          refreshing && !match ? (
            <ActivityIndicator size="large" color={COLORS.white} />
          ) : (
            `${t('matches:playersLabel')} (${
              match?.attributes.Players?.length
            }/${match?.attributes.Capacity})`
          )
        }
        headerRight={Me?.data?.isOrganizer && headerRightHandler()}
        onPressBack={onPressBack}
        renderScene={currentScene === 400 ? renderScenesRef : renderScenesOrg}
        modalIsActive={modalIsActive}
        setModalIsActive={() => {
          setModalIsActive(!modalIsActive);
          setTimeout(() => {
            setSelectedPlayerWallet(null);
            setIsShowingDetails(false);
            setExchangeModal(false);
          }, 500);
        }}
        modalStyle={isShowingDetails && 'halfWithEdge'}
        modalBody={isShowingDetails ? DetailsModal : ModalBody}
        refreshHandler={fetchMatchHandler}
        refreshing={refreshing}
      />
    );
  } else {
    return (
      <HeroContainer
        title={
          refreshing && !match ? (
            <ActivityIndicator size="large" color={COLORS.white} />
          ) : (
            `${
              currentLang === 'ar'
                ? match?.attributes.NameAR
                  ? match?.attributes.NameAR
                  : match?.attributes.Name
                : match?.attributes.Name
            } (${match?.attributes.Players?.length}/${
              match?.attributes.Capacity
            })`
          )
        }
        onPressBack={onPressBack}
        refreshHandler={fetchMatchHandler}
        refreshing={refreshing}>
        <View style={styles.container}>{GuestsRoute}</View>
      </HeroContainer>
    );
  }
}

export default PlayersScreen;
