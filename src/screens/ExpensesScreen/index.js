import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import HeroContainer from '@containers/hero_container';
import {View, TouchableWithoutFeedback, Keyboard} from 'react-native';

import {METRICS} from '@theme/metrics';
import {styles} from '@styles';
import CustomText from '@components/custom/custom_text';
import Button from '@components/atoms/button';
import Icon from '@components/atoms/icon';
import {useSelector, useDispatch} from 'react-redux';
import {
  getMatches,
  getMe,
  getPastMatches,
  getCountry,
  getTournaments,
  getPastTournaments,
} from '@stores/selectors';

import {COLORS} from '@theme/colors';
import {t} from 'i18next';

import Input from '@components/atoms/input';
import {AddMatchExpenses, AddTournamentExpenses} from '@config/functions';
import {fetchMatch, fetchTournament} from '@stores/services';

function ExpensesScreen(props) {
  const navigation = useNavigation();
  const {matchID, isPast, matchType} = props.route.params;
  const dispatch = useDispatch();
  const upcomingMatches = useSelector(
    matchType === 'match' ? getMatches : getTournaments,
  );
  const pastMatches = useSelector(
    matchType === 'match' ? getPastMatches : getPastTournaments,
  );
  const [apiCall, setApiCall] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const countryCode = useSelector(getCountry);

  const match = upcomingMatches?.find(m => m.id === matchID);

  const currency = match.Location?.Country === 'JO' ? 'JOD' : 'QR';
  const Me = useSelector(getMe);

  const [modalIsActive, setModalIsActive] = useState(false);

  const [modalTitle, setModalTitle] = useState(''); // ['Language', 'Theme'
  const [modalDescription, setModalDescription] = useState(''); // ['Language', 'Theme'

  const [expensesValues, setExpensesValue] = useState({
    Referee: match?.Expenses?.Referee ?? 0,
    Organizer: match?.Expenses?.Organizer ?? 0,
    Pitch: match?.Expenses?.Pitch ?? 0,
    Water: match?.Expenses?.Water ?? 0,
    Other: match?.Expenses?.Other ?? 0,
    OtherDescription: match?.Expenses?.OtherDescription ?? '',
  });

  // State variable to track changes made to the inputs
  const [inputValues, setInputValues] = useState(expensesValues);

  const onSaveHandler = () => {
    setExpensesValue(inputValues);
    setModalIsActive(false);
  };

  const modalBody = (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
        <View style={{alignItems: 'flex-start'}}>
          <CustomText
            style={[
              styles.fontSize.compact,
              styles.fontWeight.fw600,
              {marginBottom: METRICS.spaceSmall},
            ]}>
            {modalTitle ? modalTitle : 'Enter title'}
          </CustomText>
          <CustomText
            style={[
              styles.fontSize.small,
              {marginBottom: METRICS.spaceMedium},
            ]}>
            {modalDescription ? modalDescription : 'Enter description'}
          </CustomText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Input
            text={expensesValues[apiCall]?.toString()}
            inputMode={'decimal'}
            placeholder={t('common:enterValue')}
            onChange={value => {
              switch (apiCall) {
                case 'Referee':
                  setInputValues({
                    ...inputValues,
                    Referee: value,
                  });
                  break;
                case 'Organizer':
                  setInputValues({
                    ...inputValues,
                    Organizer: value,
                  });
                  break;
                case 'Pitch':
                  setInputValues({
                    ...inputValues,
                    Pitch: value,
                  });
                  break;
                case 'Water':
                  setInputValues({
                    ...inputValues,
                    Water: value,
                  });
                  break;
                default:
                  setInputValues({
                    ...inputValues,
                    Other: value,
                  });
                  break;
              }
            }}
          />
        </View>
        {apiCall === 'Other' && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: METRICS.spaceSmall,
            }}>
            <Input
              text={expensesValues.OtherDescription}
              inputMode={'text'}
              placeholder={t('matches:enterOtherExpensesDescription')}
              onChange={value => {
                setInputValues({
                  ...inputValues,
                  OtherDescription: value,
                });
              }}
            />
          </View>
        )}
        <View style={styles.buttonRow}>
          <Button
            content={t('common:save')}
            onPress={onSaveHandler}
            variant="solid"
            size="normal"
            fullWidth
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const onPressBack = () => {
    navigation.goBack();
  };

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

  const submitExpensesHandler = async () => {
    setLoadingSubmit(true);
    let expensesAdded;

    if (matchType === 'match') {
      expensesAdded = await AddMatchExpenses(matchID, expensesValues, Me?.jwt);
    } else {
      expensesAdded = await AddTournamentExpenses(
        matchID,
        expensesValues,
        Me?.jwt,
      );
    }

    if (expensesAdded.status === 200) {
      setLoadingSubmit(false);
      if (matchType === 'match') {
        dispatch(fetchMatch(matchID));
      } else {
        dispatch(fetchTournament(matchID));
      }
    } else {
      setLoadingSubmit(false);
    }
  };

  const bottomButton = (
    <View
      style={[
        styles.container,
        {position: 'absolute', bottom: 20, zIndex: 1, left: 0, right: 0},
      ]}>
      <Button
        content={t('matches:submitExpenses')}
        variant={'solid'}
        size="normal"
        loading={loadingSubmit}
        onPress={submitExpensesHandler}
        fullWidth
        disabled={
          Object.keys(expensesValues)
            .filter(key => key !== 'OtherDescription')
            .every(key => expensesValues[key] === 0) || loadingSubmit
        }
      />
    </View>
  );

  return (
    <HeroContainer
      title={`${t('matches:expensesLabel')} (${calculateExpenses()})`}
      modalIsActive={modalIsActive}
      onPressBack={onPressBack}
      bottomButton={bottomButton}
      setModalIsActive={() => {
        setModalIsActive(!modalIsActive);
        setTimeout(() => {
          setModalTitle('');
        }, 500);
      }}
      modalBody={modalBody}>
      {/* Profile Avatar */}

      <View
        style={[
          styles.container,
          {
            marginBottom: METRICS.spaceLarge,
            alignItems: 'flex-start',
          },
        ]}>
        <CustomText style={[styles.fontSize.small, styles.fontWeight.fw600]}>
          {t('matches:staffExpenses')}
        </CustomText>
        <Button
          content={`${t('matches:refereeLabel')}: ${
            expensesValues['Referee']
          } ${t(`common:${currency.toLowerCase()}`)}`}
          iconLeft={<Icon name="whistle" size={20} color={COLORS.white} />}
          onPress={() => {
            setModalTitle(t('matches:refereeLabel'));
            setModalDescription(t('matches:enterRefereeExpenses'));
            setApiCall('Referee');
            setModalIsActive(!modalIsActive);
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        />
        <Button
          content={`${t('matches:organizerLabel')}: ${
            expensesValues['Organizer']
          } ${t(`common:${currency.toLowerCase()}`)}`}
          iconLeft={<Icon name="user" size={20} color={COLORS.white} />}
          onPress={() => {
            setModalTitle(t('matches:organizerLabel'));
            setModalDescription(t('matches:enterOrganizerExpenses'));
            setApiCall('Organizer');
            setModalIsActive(!modalIsActive);
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        />
      </View>

      <View
        style={[
          styles.container,
          {
            marginBottom: METRICS.spaceLarge,
            alignItems: 'flex-start',
          },
        ]}>
        <CustomText style={[styles.fontSize.small, styles.fontWeight.fw600]}>
          {t('matches:pitchExpenses')}
        </CustomText>
        <Button
          content={`${t('matches:pitchLabel')}: ${expensesValues['Pitch']} ${t(
            `common:${currency.toLowerCase()}`,
          )}`}
          iconLeft={
            <Icon name="football-field" size={20} color={COLORS.white} />
          }
          onPress={() => {
            setModalTitle(t('matches:pitchLabel'));
            setModalDescription(t('matches:enterPitchExpenses'));
            setApiCall('Pitch');
            setModalIsActive(!modalIsActive);
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        />
        <Button
          content={`${t('matches:waterLabel')}: ${expensesValues['Water']} ${t(
            `common:${currency.toLowerCase()}`,
          )}`}
          iconLeft={<Icon name="water" size={20} color={COLORS.white} />}
          onPress={() => {
            setModalTitle(t('matches:waterLabel'));
            setModalDescription(t('matches:enterWaterExpenses'));
            setApiCall('Water');
            setModalIsActive(!modalIsActive);
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        />
        <Button
          content={`${t('matches:otherExpensesLabel')}: ${
            expensesValues['Other']
          } ${t(`common:${currency.toLowerCase()}`)}`}
          iconLeft={
            <Icon name="clipboard-list" size={20} color={COLORS.white} />
          }
          onPress={() => {
            setModalTitle(t('matches:otherExpensesLabel'));
            setModalDescription(t('matches:enterOtherExpenses'));
            setApiCall('Other');
            setModalIsActive(!modalIsActive);
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        />
      </View>
    </HeroContainer>
  );
}

export default ExpensesScreen;
