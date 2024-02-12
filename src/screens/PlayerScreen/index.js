import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import HeroContainer from '@containers/hero_container';
import {Alert, Linking, View, ActivityIndicator} from 'react-native';
import {METRICS} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import {styles} from '@styles';
import CustomText from '@components/custom/custom_text';
import Avatar from '@components/atoms/avatar';
import Button from '@components/atoms/button';
import Icon from '@components/atoms/icon';

import {
  rootURL,
  CreateWallet,
  GetWalletByUserID,
  AddTransaction,
} from '@config/functions';
import {t} from 'i18next';
import Input from '@components/atoms/input';
import {useSelector} from 'react-redux';
import {getMe, getCountry, getCurrency, getLanguage} from '@stores/selectors';
import PlayerStats from '@components/atoms/player_stats';
import {FindMatchesStats} from '../../config/functions';

function PlayerScreen(props) {
  const Me = useSelector(getMe);
  const countryCode = useSelector(getCountry);
  const currentCurrencey = useSelector(getCurrency);
  const currentLang = useSelector(getLanguage);
  const navigation = useNavigation();
  const {Player, matchID, matchType} = props.route.params;

  const [amount, setAmount] = useState(0);
  const [cashAmount, setCashAmount] = useState(0);
  const [loadingMain, setLoadingMain] = useState(false);
  const [loadingAmount, setLoadingAmount] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [walletID, setWalletID] = useState(null);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [walletDetails, setWalletDetails] = useState(null);
  const [transactionType, setTransactionType] = useState(null);
  const getWalletBalance = async () => {
    setLoadingWallet(true);
    const hasWalletResp = await GetWalletByUserID(
      Player?.data?.id,
      Me?.jwt,
      countryCode,
    );

    if (hasWalletResp.data.data[0]) {
      setWalletDetails(hasWalletResp.data.data[0]);
      setLoadingWallet(false);
    } else {
      setLoadingWallet(false);
    }
  };

  const fetchStatsHandler = async () => {
    setFetchingStats(true);
    try {
      const response = await FindMatchesStats(
        Player?.data?.id,
        countryCode,
        Me?.jwt,
      );
      setPlayerStats(response.data);
      setFetchingStats(false);
    } catch (e) {
      setFetchingStats(false);
    }
  };
  useEffect(() => {
    getWalletBalance();
  }, [walletDetails]);

  useEffect(() => {
    fetchStatsHandler();
  }, []);
  const onPressBack = () => {
    navigation.goBack();
  };

  const onChangeHandler = value => {
    setAmount(value);
  };

  const onChangeCashHandler = value => {
    setCashAmount(value);
  };
  const modalBody = (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
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

      {transactionType === 'ReturnChange' && (
        <View style={{marginBottom: METRICS.spaceSmall}}>
          <Input
            text={cashAmount}
            inputMode={'numeric'}
            placeholder={t('wallet:cashPaidPlaceholder')}
            onChange={onChangeCashHandler}
          />
        </View>
      )}
      <Input
        text={amount}
        inputMode={'numeric'}
        placeholder={t('wallet:returnCashLabel')}
        onChange={onChangeHandler}
      />

      <View style={styles.buttonRow}>
        <Button
          content={t('matches:confirmLabel')}
          disabled={loadingAmount}
          loading={loadingAmount}
          variant="solid"
          size="normal"
          fullWidth
          onPress={() => sendAmountHandler()}
        />
      </View>
    </View>
  );

  const addFundsHandler = async () => {
    setLoadingMain(true);
    setTransactionType('AddFunds');
    setModalActive(true);
  };
  const returnChangeHandler = async () => {
    setLoadingMain(true);
    setTransactionType('ReturnChange');
    setModalActive(true);
  };

  const createWalletHandler = async () => {
    const createWalletResp = await CreateWallet(
      Player?.data?.id,
      currentCurrencey,
      countryCode,
      Me?.jwt,
    );
    if (createWalletResp.status === 200) {
      getWalletBalance();
    }
  };

  const sendAmountHandler = async () => {
    setLoadingAmount(true);

    if (!amount) {
      Alert.alert(t('wallet:enterAmountLabel'), t('wallet:alertEnterAmount'), [
        {
          text: t('common:tryAgain'),
          onPress: () => {
            setLoadingAmount(false);
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
              setLoadingAmount(false);
            },
          },
        ],
      );
      return;
    }

    if (transactionType === 'ReturnChange' && !cashAmount) {
      Alert.alert(t('wallet:enterAmountLabel'), t('wallet:alertEnterAmount'), [
        {
          text: t('common:tryAgain'),
          onPress: () => {
            setLoadingAmount(false);
          },
        },
      ]);
      return;
    }

    if (transactionType === 'ReturnChange' && cashAmount < 1) {
      Alert.alert(
        t('wallet:enterAmountLabel'),
        t('wallet:alertBiggerThanZero'),
        [
          {
            text: t('common:tryAgain'),
            onPress: () => {
              setLoadingAmount(false);
            },
          },
        ],
      );
      return;
    }

    const addTransactionResp = await AddTransaction(
      walletDetails?.id,
      Me?.data?.id,
      transactionType,
      amount,
      matchID,
      matchType,
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
              setLoadingAmount(false);
              sendAmountHandler();
            },
          },
        ],
      );
      return;
    }

    setLoadingAmount(false);
    setModalActive(false);
    setLoadingMain(false);
    setTransactionType(null);
    setWalletID(null);
    setAmount(0);
    setCashAmount(0);
  };

  const [playerStats, setPlayerStats] = useState({
    redCards: 0,
    yellowCards: 0,
    goals: 0,
    assists: 0,
    motm: 0,
  });
  const [fetchingStats, setFetchingStats] = useState(false);

  return (
    <HeroContainer
      title={`${Player?.data?.attributes?.username}`}
      onPressBack={onPressBack}
      modalIsActive={modalActive}
      setModalIsActive={() => {
        setModalActive(false);
        setTimeout(() => {
          setLoadingAmount(false);
          setLoadingMain(false);
        }, 500);
      }}
      modalBody={modalBody}>
      {/* Profile Avatar */}
      <View style={[styles.container, {marginBottom: METRICS.spaceLarge}]}>
        <View
          style={[
            styles.alignCenter,
            {
              marginTop: METRICS.spaceMedium,
              marginBottom: METRICS.spaceNormal,
            },
          ]}>
          <Avatar
            img={
              Player?.data?.attributes?.Image.data
                ? rootURL + Player?.data?.attributes?.Image.data.attributes.url
                : null
            }
            name={`${Player?.data?.attributes?.FirstName} ${Player?.data?.attributes?.LastName}`}
            size="Xlarge"
          />
          <CustomText
            style={[
              styles.fontSize.compact,
              styles.fontWeight.fw600,
              {marginRight: METRICS.spaceTiny},
            ]}>
            {`${Player?.data?.attributes?.FirstName} ${Player?.data?.attributes?.LastName}`}
          </CustomText>
        </View>

        <View
          style={[
            {
              marginBottom: METRICS.spaceSmall,
            },
          ]}>
          <PlayerStats
            redCards={playerStats.redCards}
            yellowCards={playerStats.yellowCards}
            assists={playerStats.assists}
            goals={playerStats.goals}
            motm={playerStats.motm}
            loading={fetchingStats}
          />
        </View>

        {Me?.data?.role?.type === 'organizer' && (
          <>
            {walletDetails !== null ? (
              <View style={styles.flex}>
                <View style={{marginBottom: METRICS.spaceNormal}}>
                  <CustomText
                    style={[
                      styles.fontSize.medium,
                      styles.fontWeight.fw600,
                      {marginBottom: METRICS.spaceSmall},
                    ]}>
                    {t('wallet:theBalance')}
                  </CustomText>

                  <CustomText
                    style={[styles.fontSize.large, styles.fontWeight.fw600]}>
                    {`${
                      walletDetails?.attributes.Balance +
                      t(
                        `common:${walletDetails?.attributes.Currency.toLowerCase()}`,
                      )
                    }`}
                  </CustomText>
                </View>
                <View style={[styles.rowContainer, styles.alignCenter]}>
                  <Button
                    loading={loadingMain}
                    disabled={loadingMain}
                    content={t('wallet:addFunds')}
                    variant={'adding'}
                    size="normal"
                    fullWidth={true}
                    onPress={addFundsHandler}
                    style={{marginRight: METRICS.spaceTiny}}
                  />
                </View>
              </View>
            ) : (
              <View style={[styles.rowContainer, styles.flex]}>
                {loadingWallet ? (
                  <ActivityIndicator size="large" color={COLORS.white} />
                ) : (
                  <Button
                    loading={loadingMain}
                    disabled={loadingMain}
                    content={t('wallet:createWalletTitle')}
                    variant={'solid'}
                    size="normal"
                    onPress={createWalletHandler}
                    fullWidth
                  />
                )}
              </View>
            )}
          </>
        )}
      </View>

      <View style={[styles.container, {marginBottom: METRICS.spaceLarge}]}>
        <CustomText style={[styles.fontSize.small, styles.fontWeight.fw600]}>
          {t('profile:detailsLabel')}
        </CustomText>

        <Button
          content={Player?.data?.attributes?.email}
          iconLeft={<Icon name="at" size={20} color={COLORS.white} />}
          onPress={() => {
            Linking.openURL(`mailto:${Player?.data?.attributes?.email}`);
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        />
        <Button
          content={Player?.data?.attributes?.Phone}
          iconLeft={<Icon name="call" size={20} color={COLORS.white} />}
          onPress={() => {
            Linking.openURL(`tel:${Player?.data?.attributes?.Phone}`);
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        />

        <Button
          content={Player?.data?.attributes?.EmergencyPhone}
          iconLeft={<Icon name="call" size={20} color={COLORS.white} />}
          onPress={() => {
            Linking.openURL(`tel:${Player?.data?.attributes?.EmergencyPhone}`);
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        />

        <Button
          content={`Age: ${Player?.data?.attributes?.Age} years`}
          iconLeft={<Icon name="calendar" size={20} color={COLORS.white} />}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        />
      </View>
    </HeroContainer>
  );
}

export default PlayerScreen;
