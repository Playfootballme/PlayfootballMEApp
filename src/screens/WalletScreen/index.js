import React, {useCallback, useState} from 'react';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

import HeroContainer from '@containers/hero_container';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  TouchableOpacity,
  View,
} from 'react-native';
import {METRICS} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import {styles} from '@styles';
import CustomText from '@components/custom/custom_text';
import Avatar from '@components/atoms/avatar';
import Button from '@components/atoms/button';
import Icon from '@components/atoms/icon';

import {
  rootURL,
  GetWalletByUserID,
  SendReceipt,
  CreateWallet,
} from '@config/functions';
import {useSelector} from 'react-redux';
import {getMe, getCountry, getCurrency, getLanguage} from '@stores/selectors';

import moment from 'moment';
import CustomImage from '@components/custom/custom_image';
import {WalletRewardPackages} from '@config/functions';
import Checkbox from '@components/atoms/checkbox';
import {t} from 'i18next';

function WalletScreen(props) {
  const navigation = useNavigation();
  const Me = useSelector(getMe);
  const currentLang = useSelector(getLanguage);
  const countryCode = useSelector(getCountry);
  const currentCurrency = useSelector(getCurrency);

  const onPressBack = () => {
    navigation.goBack();
  };

  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [loadingPackages, setLoadingPackages] = useState(false);

  const [walletPackages, setWalletPackages] = useState([]);

  const [walletDetails, setWalletDetails] = useState(null);
  const [modalIsActive, setModalIsActive] = useState(false);
  const [isShowingDetails, setIsShowingDetails] = useState(false);
  const [instagramLink, setInstagramLink] = useState('');

  const [modalDetails, setModalDetails] = useState({
    id: '',
    type: 'Add',
    color: 'green',
    title: t('wallet:depositedByLabel'),
    participant: null,
    amount: '',
    date: '',
    note: '',
  });

  const fetchData = async () => {
    setLoading(true);
    const userWallet = await GetWalletByUserID(
      Me?.data?.id,
      Me?.jwt,
      countryCode,
    );
    if (userWallet?.data?.data?.length > 0) {
      setLoading(false);
      setWalletDetails(userWallet.data.data[0]);
    } else {
      setLoading(false);
    }

    // const response = await fetch(`${apiEndpoint}/general-setting`);
    // const data = await response.json();
    // setInstagramLink(data.data?.attributes[`${countryCode}_InstagramLink`]);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  const DetailsModal = (
    <View>
      <View style={styles.modalRow}>
        <View
          style={[styles.rowContainer, styles.alignCenter, {marginRight: 50}]}>
          <CustomText
            style={[styles.fontSize.small, {marginLeft: METRICS.spaceTiny}]}>
            {modalDetails.title}
          </CustomText>
        </View>

        <View style={[styles.alignCenter, styles.rowContainer]}>
          {['organizer'].includes(
            modalDetails.participant?.role?.data?.attributes?.type,
          ) ? (
            <Avatar
              img={require('@assets/images/logo-white.png')}
              name={'playfootball me'}
              backgroundColor={COLORS.lightBlack}
              isLocalImg
              resizeMode={'contain'}
              style={{padding: 15}}
              size={'small'}
            />
          ) : (
            <Avatar
              img={
                modalDetails.participant?.Image?.data
                  ? rootURL +
                    modalDetails.participant?.Image?.data.attributes.url
                  : null
              }
              name={
                modalDetails.participant?.FirstName +
                ' ' +
                modalDetails.participant?.LastName
              }
              size={'small'}
            />
          )}
          <View style={[{marginLeft: METRICS.spaceTiny}]}>
            <CustomText style={[styles.fontSize.small]}>
              {modalDetails.participant?.FirstName +
                ' ' +
                modalDetails.participant?.LastName}
            </CustomText>
          </View>
        </View>
      </View>

      <View style={styles.modalRow}>
        <View
          style={[styles.rowContainer, styles.alignCenter, {marginRight: 50}]}>
          <CustomText
            style={[styles.fontSize.small, {marginLeft: METRICS.spaceTiny}]}>
            {t('wallet:amountLabel')}
          </CustomText>
        </View>
        <CustomText
          style={[styles.fontSize.small, {color: modalDetails.color}]}>
          {modalDetails.amount}
        </CustomText>
      </View>

      <View style={styles.modalRow}>
        <View
          style={[styles.rowContainer, styles.alignCenter, {marginRight: 50}]}>
          <CustomText
            style={[styles.fontSize.small, {marginLeft: METRICS.spaceTiny}]}>
            {t('wallet:dateLabel')}
          </CustomText>
        </View>
        <CustomText style={[styles.fontSize.small]}>
          {modalDetails.date}
        </CustomText>
      </View>

      <View style={[styles.modalRow, {marginBottom: METRICS.spaceSmall}]}>
        <View
          style={[styles.rowContainer, styles.alignCenter, {marginRight: 50}]}>
          <CustomText
            style={[styles.fontSize.small, {marginLeft: METRICS.spaceTiny}]}>
            {t('wallet:noteLabel')}
          </CustomText>
        </View>
        <View style={[styles.rowContainer, styles.flex]}>
          <CustomText
            style={[
              styles.fontSize.small,
              {flex: 1, flexWrap: 'wrap', textAlign: 'right'},
            ]}>
            {modalDetails.note ? modalDetails.note : 'N/A'}
          </CustomText>
        </View>
      </View>

      {/* <Button
        loading={loadingButton}
        disabled={loadingButton}
        content={t('wallet:emailReceipt')}
        variant={'solid'}
        size="normal"
        fullWidth={true}
        onPress={async () => {
          setLoadingButton(true);

          const emailSentResp = await SendReceipt(
            walletDetails?.id,
            modalDetails?.id,
            Intl.DateTimeFormat().resolvedOptions().timeZone,
            Me?.jwt,
          );
          if (emailSentResp.status === 200) {
            setLoadingButton(false);
            setModalIsActive(false);
          }
        }}
      /> */}
    </View>
  );
  const BuyModal = (
    <View>
      <CustomText
        style={[
          styles.fontSize.medium,
          styles.fontWeight.fw600,
          {textAlign: 'center', marginBottom: METRICS.spaceNormal},
        ]}>
        {t('wallet:buyCreditTitle')}
      </CustomText>

      <CustomText style={[{textAlign: 'center'}, styles.fontSize.small]}>
        {t('wallet:buyCreditDesc')}
      </CustomText>

      {loadingPackages ? (
        <View style={{marginTop: METRICS.spaceLarge}}>
          <ActivityIndicator size={'large'} color={COLORS.white} />
        </View>
      ) : (
        walletPackages.length > 0 && (
          <View style={{marginTop: METRICS.spaceLarge}}>
            <CustomText
              style={[
                {textAlign: 'center', marginBottom: METRICS.spaceSmall},
                styles.fontWeight.fw600,
              ]}>
              {t('wallet:availablePackagesLabel')}
            </CustomText>
            <FlatList
              data={walletPackages}
              renderItem={item => {
                return (
                  <View
                    style={[
                      {marginBottom: METRICS.spaceMedium, minWidth: 150},
                    ]}>
                    <CustomText
                      style={[
                        {textAlign: 'center'},
                        styles.fontWeight.fw700,
                        styles.fontSize.medium,
                      ]}>
                      {
                        item.item.attributes[
                          `Title${currentLang.toUpperCase()}`
                        ]
                      }
                    </CustomText>
                    <CustomText
                      style={[{textAlign: 'center'}, styles.fontSize.small]}>
                      {`${t('wallet:buyNow')} ${
                        item.item.attributes.TriggerCondition.Value
                      } ${t(
                        `common:${walletDetails?.attributes?.Currency.toLowerCase()}`,
                      )} ${t('wallet:andGet')} ${
                        item.item.attributes.Reward.Value
                      } ${t(
                        `common:${walletDetails?.attributes?.Currency.toLowerCase()}`,
                      )} ${t('wallet:bonus')}`}
                    </CustomText>
                  </View>
                );
              }}
            />
          </View>
        )
      )}
    </View>
  );

  const createWalletHandler = async () => {
    setLoadingButton(true);

    if (!acceptTerms) {
      Alert.alert(t('wallet:createWalletTitle'), t('common:alertAcceptTC'), [
        {text: t('common:tryAgain'), onPress: () => setLoadingButton(false)},
      ]);
      return;
    }

    const createdWallet = await CreateWallet(
      Me?.data?.id,
      currentCurrency,
      countryCode,
      Me?.jwt,
    );

    if (createdWallet.status === 200) {
      setLoadingButton(false);
      fetchData();
    }
  };

  const onPressBuyHandler = async () => {
    setModalIsActive(true);
    setIsShowingDetails(false);
    setLoadingPackages(true);
    const wallet_packags_resp = await WalletRewardPackages(
      walletDetails?.attributes?.Country,
    );
    if (wallet_packags_resp.status === 200) {
      setWalletPackages(wallet_packags_resp.data.data);
      setLoadingPackages(false);
    }
  };
  const [acceptTerms, setAcceptTerms] = useState(false);

  if (!walletDetails) {
    return (
      <HeroContainer
        title={loading ? t('common:loading') : t('wallet:createWalletTitle')}
        onPressBack={onPressBack}>
        <View style={[styles.container, styles.flex]}>
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <View>
              <View style={styles.alignCenter}>
                <View
                  style={[
                    {
                      width: 250,
                      height: 250,
                      backgroundColor: COLORS.lighterGrey,
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      borderRadius: 500,
                      overflow: 'hidden',
                      marginBottom: METRICS.spaceLarge,
                    },
                  ]}>
                  <CustomImage
                    style={{width: 150, height: 200}}
                    source={require('@assets/images/wallet_mockup.png')}
                    resizeMode="contain"
                  />
                </View>
              </View>
              <CustomText
                style={[
                  styles.fontSize.compact,
                  styles.fontWeight.fw700,
                  {textAlign: 'center', marginBottom: METRICS.spaceNormal},
                ]}>
                {t('wallet:createWalletDesc')}
              </CustomText>
              <TouchableOpacity
                style={{
                  marginBottom: METRICS.spaceXXLarge,
                }}
                onPress={() => {
                  navigation.navigate('ProfileStack', {
                    screen: 'WalletTermsConditionsScreen',
                  });
                }}>
                <CustomText
                  style={[
                    styles.fontWeight.fw700,
                    {
                      textAlign: 'center',
                      color: COLORS.blue,
                    },
                  ]}>
                  {t('wallet:createWalletReadTC')}
                </CustomText>
              </TouchableOpacity>
              <View style={[{marginBottom: METRICS.spaceSmall}]}>
                <Checkbox
                  label={t('common:acceptTCLabel')}
                  value={acceptTerms}
                  onChange={() => setAcceptTerms(!acceptTerms)}
                />
              </View>
              <Button
                loading={loadingButton}
                disabled={loadingButton}
                content={t('wallet:createButton')}
                variant={'solid'}
                size="normal"
                fullWidth={true}
                onPress={createWalletHandler}
              />
            </View>
          )}
        </View>
      </HeroContainer>
    );
  }

  return (
    <HeroContainer
      title={loading ? t('common:loading') : `${t('wallet:mainTitle')}`}
      onPressBack={onPressBack}
      modalIsActive={modalIsActive}
      setModalIsActive={() => {
        setModalIsActive(false);
        setTimeout(() => {
          setIsShowingDetails(false);
        }, 500);
      }}
      modalStyle={isShowingDetails ? 'halfWithEdge' : 'fullWithEdge'}
      modalBody={isShowingDetails ? DetailsModal : BuyModal}>
      <View style={[styles.container, styles.flex]}>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <View>
            <TouchableOpacity
              style={{
                marginBottom: METRICS.spaceMedium,
              }}
              onPress={() => {
                navigation.navigate('ProfileStack', {
                  screen: 'WalletTermsConditionsScreen',
                });
              }}>
              <CustomText
                style={[
                  styles.fontWeight.fw700,
                  {
                    color: COLORS.blue,
                  },
                ]}>
                {t('wallet:createWalletReadTC')}
              </CustomText>
            </TouchableOpacity>
            <View style={{marginBottom: METRICS.spaceNormal}}>
              <CustomText
                style={[
                  styles.fontSize.small,
                  styles.fontWeight.fw600,
                  {marginBottom: METRICS.spaceSmall},
                ]}>
                {t('wallet:yourBalance')}
              </CustomText>

              <CustomText
                style={[styles.fontSize.large, styles.fontWeight.fw600]}>
                {`${
                  walletDetails?.attributes?.Balance +
                  t(
                    `common:${walletDetails?.attributes?.Currency.toLowerCase()}`,
                  )
                }`}
              </CustomText>
            </View>

            <View
              style={[
                styles.rowContainer,
                styles.alignCenter,
                {marginBottom: METRICS.spaceNormal},
              ]}>
              <Button
                content={t('wallet:buyButton')}
                onPress={onPressBuyHandler}
                variant={'solid'}
                size="normal"
                halfWidth={true}
                style={{marginRight: METRICS.spaceTiny}}
              />

              <Button
                content={t('wallet:transferButton')}
                onPress={() => {
                  navigation.navigate('ProfileStack', {
                    screen: 'TransferCreditScreen',
                    params: {
                      walletID: walletDetails?.id,
                      walletCurrency: walletDetails?.attributes?.Currency,
                      recentTransfers: Array.from(
                        new Set(
                          (walletDetails?.attributes?.TransactionsHistory || [])
                            .filter(
                              transaction => transaction?.Type === 'Transfer',
                            )
                            .map(
                              transaction_map =>
                                transaction_map.Participant.data.id,
                            ),
                        ),
                      )
                        .map(uniqueId => {
                          const transaction_map = (
                            walletDetails?.attributes?.TransactionsHistory || []
                          ).find(
                            transaction =>
                              transaction?.Type === 'Transfer' &&
                              transaction.Participant.data.id === uniqueId,
                          );

                          if (!transaction_map) return null;

                          const Participant =
                            transaction_map.Participant.data.attributes;
                          return {
                            id: uniqueId,
                            email: Participant.email,
                            Image: Participant.Image?.data,
                            FirstName: Participant.FirstName,
                            LastName: Participant.LastName,
                          };
                        })
                        .filter(entry => entry !== null),
                    },
                  });
                }}
                variant={'delete'}
                size="normal"
                halfWidth={true}
              />
            </View>

            <View>
              <CustomText
                style={[styles.fontSize.small, styles.fontWeight.fw600]}>
                {t('wallet:transactionHistoryLabel')}
              </CustomText>
              {walletDetails?.attributes?.TransactionsHistory.length > 0 ? (
                walletDetails?.attributes?.TransactionsHistory?.map(
                  (transaction, index) => {
                    const Participant = transaction.Participant.data.attributes;

                    let operationText = '+';
                    let iconName = 'arrow-down-left';
                    if (['Deduct', 'Transfer'].includes(transaction?.Type)) {
                      operationText = '-';
                    }

                    let generalColor = COLORS.green;

                    if (['Deduct'].includes(transaction?.Type)) {
                      generalColor = COLORS.red;
                      iconName = 'arrow-up-right';
                    }

                    if (['Transfer'].includes(transaction?.Type)) {
                      generalColor = COLORS.red;
                      iconName = 'arrow-up-right';
                    }

                    let transactionType = t('wallet:depositedByLabel');
                    if (['Transfer'].includes(transaction?.Type)) {
                      transactionType = t('wallet:transferedToLabel');
                    }
                    if (['Deduct'].includes(transaction?.Type)) {
                      transactionType = t('wallet:processedByLabel');
                    }
                    return (
                      <TouchableOpacity
                        style={styles.modalRowColumn}
                        key={index}
                        onPress={() => {
                          setIsShowingDetails(true);
                          setModalIsActive(true);
                          setModalDetails({
                            id: transaction?.id,
                            type: transaction?.Type,
                            color: generalColor,
                            title: transactionType,
                            participant: Participant,
                            amount: `${operationText}${
                              transaction?.Amount +
                              t(
                                `common:${walletDetails?.attributes?.Currency.toLowerCase()}`,
                              )
                            }`,
                            date: moment(transaction?.Date).format(
                              'YYYY-MM-DD LT',
                            ),
                            note:
                              currentLang === 'ar'
                                ? transaction.NoteAR
                                : transaction.Note,
                          });
                        }}>
                        <View style={[styles.rowContainer, styles.alignCenter]}>
                          <View
                            style={[
                              styles.flex,
                              styles.rowContainer,
                              styles.alignCenter,
                              {marginLeft: METRICS.spaceTiny},
                            ]}>
                            <Icon
                              name={iconName}
                              size={22}
                              color={generalColor}
                            />
                            <View
                              style={[
                                styles.flex,
                                {marginLeft: METRICS.spaceTiny},
                              ]}>
                              <View style={styles.rowContainer}>
                                <CustomText
                                  style={[
                                    styles.fontSize.small,
                                    {flex: 1, flexWrap: 'wrap'},
                                  ]}>
                                  {currentLang === 'ar'
                                    ? transaction?.NoteAR
                                    : transaction?.Note}
                                </CustomText>
                              </View>

                              <CustomText
                                style={[
                                  styles.fontSize.tiny,
                                  styles.fontWeight.fw400,
                                  styles.fontColor.grey,
                                ]}>
                                {moment(transaction?.Date).format(
                                  'YYYY-MM-DD LT',
                                )}
                              </CustomText>
                            </View>
                          </View>
                          <View
                            style={[styles.rowContainer, styles.alignCenter]}>
                            <CustomText
                              style={[
                                styles.fontSize.small,
                                {
                                  textAlign: 'right',
                                  color: generalColor,
                                  marginRight: METRICS.spaceTiny,
                                },
                              ]}>
                              {`${operationText}${
                                transaction?.Amount +
                                t(
                                  `common:${walletDetails?.attributes?.Currency.toLowerCase()}`,
                                )
                              }`}
                            </CustomText>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  },
                )
              ) : (
                <CustomText style={{marginTop: METRICS.spaceTiny}}>
                  {t('wallet:emptyTransactionsLabel')}
                </CustomText>
              )}
            </View>
          </View>
        )}
      </View>
    </HeroContainer>
  );
}

export default WalletScreen;
