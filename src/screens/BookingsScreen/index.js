import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import ListContainer from '@containers/list_container';
import {useSelector, useDispatch} from 'react-redux';
import {getCountry, getMe} from '@stores/selectors';
import {t} from 'i18next';
import {fetchTournament, fetchMatch} from '@stores/services';

import {FindMatchesOfPlayer, FindTournamentOfPlayer} from '@config/functions';

function BookingsScreen(props) {
  const dispatch = useDispatch();
  const {matchType} = props.route.params;

  const [fetching, setFetching] = useState(false);

  const navigation = useNavigation();

  const countryCode = useSelector(getCountry);
  const Me = useSelector(getMe);

  const [currentID, setCurrentID] = useState(-1);
  const [data, setData] = useState([]);

  const fetchMatchesHandler = async () => {
    setFetching(true);
    try {
      const response =
        matchType === 'match'
          ? await FindMatchesOfPlayer(Me?.data?.id, countryCode, Me?.jwt)
          : await FindTournamentOfPlayer(Me?.data?.id, countryCode, Me?.jwt);

      if (response.status === 200) {
        setData(response.data);
      }
      setFetching(false);
    } catch (e) {
      setFetching(false);
    }
  };
  useEffect(() => {
    fetchMatchesHandler();
  }, []);

  const matchPickedHandler = matchID => {
    setCurrentID(matchID);
    new Promise(function (resolve, reject) {
      resolve(
        dispatch(
          matchType === 'match'
            ? fetchMatch(matchID)
            : fetchTournament(matchID),
        ),
      );
    }).then(function (result) {
      setCurrentID(-1);
      navigation.navigate(
        matchType === 'match' ? 'MatchStack' : 'TournamentStack',
        {
          screen: matchType === 'match' ? 'MatchScreen' : 'TournamentScreen',
          params: {matchID},
        },
      );
    });
  };

  const onPressBack = () => {
    navigation.goBack();
  };
  return (
    <ListContainer
      title={
        matchType === 'match'
          ? t('profile:yourMatchesBookings')
          : t('profile:yourTournamentsBookings')
      }
      onPressBack={onPressBack}
      data={data}
      onRefresh={fetchMatchesHandler}
      fetching={fetching}
      currentID={currentID}
      matchPickedHandler={matchPickedHandler}
      emptyString={t('profile:emptyBookings')}
    />
  );
}

export default BookingsScreen;
