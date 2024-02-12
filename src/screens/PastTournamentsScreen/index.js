import React, {useEffect, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import ListContainer from '@containers/list_container';
import {useSelector, useDispatch} from 'react-redux';
import {getTournaments, getCountry} from '@stores/selectors';
import {t} from 'i18next';
import {fetchTournament, fetchPastTournaments} from '@stores/services';

function PastTournamentsScreen(props) {
  const dispatch = useDispatch();
  const [fetching, setFetching] = useState(false);

  const navigation = useNavigation();

  const countryCode = useSelector(getCountry);
  const matches = useSelector(getTournaments);

  const upcomingMatches = useMemo(() => {
    const nowDateTime = new Date(); // Current date and time

    return matches.filter(match => {
      const matchStartDate = new Date(match.StartDate);
      return matchStartDate.getTime() < nowDateTime.getTime();
    });
  }, [matches]);

  const [currentID, setCurrentID] = useState(-1);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTournamentsHandler = () => {
    setFetching(true);
    new Promise((resolve, reject) => {
      resolve(dispatch(fetchPastTournaments(countryCode, currentPage)));
    }).then(function (result) {
      setFetching(false);
    });
  };
  useEffect(() => {
    fetchTournamentsHandler();
  }, []);

  const matchPickedHandler = matchID => {
    setCurrentID(matchID);
    new Promise(function (resolve, reject) {
      resolve(dispatch(fetchTournament(matchID)));
    }).then(function (result) {
      setCurrentID(-1);
      navigation.navigate('TournamentStack', {
        screen: 'TournamentScreen',
        params: {matchID},
      });
    });
  };
  const onPressBack = () => {
    navigation.goBack();
  };
  return (
    <ListContainer
      title={t('tournaments:pastMainTitle')}
      onPressBack={onPressBack}
      data={upcomingMatches}
      onRefresh={fetchTournamentsHandler}
      fetching={fetching}
      currentID={currentID}
      matchPickedHandler={matchPickedHandler}
      emptyString={t('tournaments:noPast')}
    />
  );
}

export default PastTournamentsScreen;
