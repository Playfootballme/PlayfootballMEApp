import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import {View, Alert, ActivityIndicator} from 'react-native';
import HeroContainer from '@containers/hero_container';
import List from '@components/organisms/list';
import MatchThumbnail from '@components/custom/match_thumbnail';
import {METRICS} from '@theme/metrics';
import {useSelector, useDispatch} from 'react-redux';
import CustomText from '@components/custom/custom_text';
import {styles} from '@styles';

import Button from '@components/atoms/button';

import TransferCredit from '@components/atoms/transfer_credit';

import Input from '@components/atoms/input';
import {AddTransaction} from '@config/functions';

import {getMe, getLanguage} from '@stores/selectors';
import {t} from 'i18next';
function TransferCreditScreen(props) {
  const {walletID, walletCurrency, recentTransfers} = props.route.params;
  const dispatch = useDispatch();
  const Me = useSelector(getMe);
  const currentLang = useSelector(getLanguage);

  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [transferToID, setTransferToID] = useState(null);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalActive, setModalActive] = useState(false);

  const navigation = useNavigation();

  const onPressBack = () => {
    navigation.goBack();
  };
  const pressHandler = id => {
    setModalActive(true);
    setTransferToID(id);
  };
  const foundHandler = users => {
    setSelectedRecipients(users);
  };

  const onChangeHandler = value => {
    setAmount(value);
  };

  const submitAmountHandler = () => {
    setLoading(true);

    let temp_user = [...selectedRecipients, ...recentTransfers].find(
      r => r.id === transferToID,
    );

    Alert.alert(
      t('wallet:transferConfirmationTitle'),
      `${t('wallet:transferConfirmationDescPt1')} ${amount}${t(
        `common:${walletCurrency.toLowerCase()}`,
      )} ${t('wallet:transferConfirmationDescPt2')} ${temp_user.FirstName} ${
        temp_user.LastName
      }`,
      [
        {
          text: t('wallet:transferApprove'),
          onPress: async () => {
            const tranactionResp = await AddTransaction(
              walletID,
              transferToID,
              'Transfer',
              amount,
              null,
              null,
              Me?.jwt,
            );
            if (
              typeof tranactionResp.data[currentLang] === 'string' &&
              tranactionResp.data[currentLang].includes('error')
            ) {
              Alert.alert(
                t('wallet:transferFailed'),
                tranactionResp.data[currentLang].split('error:')[1],
                [
                  {
                    text: t('common:tryAgain'),
                    onPress: () => {
                      setModalActive(false);
                      setLoading(false);
                    },
                  },
                ],
              );
              return;
            }

            setModalActive(false);
            setLoading(false);
            setAmount(0);
            navigation.goBack();
          },
        },
        {
          text: t('common:cancel'),
          onPress: () => {
            setLoading(false);
            setModalActive(false);
            setAmount(0);
          },
        },
      ],
    );
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
      <Input
        text={amount}
        inputMode={'numeric'}
        placeholder={t('wallet:enterAmountLabel')}
        onChange={onChangeHandler}
      />

      <View style={styles.buttonRow}>
        <Button
          content={t('wallet:transferButton')}
          disabled={loading}
          loading={loading}
          onPress={submitAmountHandler}
          variant="solid"
          size="normal"
          fullWidth
        />
      </View>
    </View>
  );

  return (
    <HeroContainer
      title={t('wallet:transferMainTitle')}
      onPressBack={onPressBack}
      modalIsActive={modalActive}
      setModalIsActive={() => {
        setModalActive(false);
      }}
      modalBody={modalBody}>
      <View style={[styles.container]}>
        <CustomText
          style={[
            styles.fontSize.normal,
            styles.fontWeight.fw600,
            {
              marginBottom: METRICS.spaceTiny,
            },
          ]}>
          {t('wallet:addRecipient')}
        </CustomText>

        <CustomText
          style={[styles.fontSize.small, {marginBottom: METRICS.spaceMedium}]}>
          {t('common:searchByEmailLabel')}
        </CustomText>
        <TransferCredit
          selectedRecipients={selectedRecipients}
          foundHandler={foundHandler}
          pressHandler={pressHandler}
          recentTransfers={recentTransfers}
        />
      </View>
    </HeroContainer>
  );
}

export default TransferCreditScreen;
