import React, {useEffect, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import ListContainer from '@containers/list_container';
import {useSelector, useDispatch} from 'react-redux';
import {getTournaments, getCountry} from '@stores/selectors';
import {t} from 'i18next';
import Icon from '@components/atoms/icon';
import {COLORS} from '@theme/colors';
import {TouchableOpacity} from 'react-native';
import {fetchTournament, fetchUpcomingTournaments} from '@stores/services';

function TournamentsScreen(props) {
  const dispatch = useDispatch();
  const [fetching, setFetching] = useState(false);

  const navigation = useNavigation();

  const countryCode = useSelector(getCountry);
  const matches = useSelector(getTournaments);

  const upcomingMatches = useMemo(() => {
    const nowDateTime = new Date(); // Current date and time

    return matches.filter(match => {
      const matchEndDateTime = new Date(match.EndDate);
      return matchEndDateTime.getTime() >= nowDateTime.getTime();
    });
  }, [matches]);

  const [currentID, setCurrentID] = useState(-1);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTournamentsHandler = () => {
    setFetching(true);
    new Promise((resolve, reject) => {
      resolve(dispatch(fetchUpcomingTournaments(countryCode, currentPage)));
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

  const headerRight = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('PastTournamentsStack', {
            screen: 'PastTournamentsScreen',
          });
        }}>
        <Icon name="time-past" color={COLORS.white} size={22} />
      </TouchableOpacity>
    );
  };

  return (
    <ListContainer
      title={t('tournaments:mainTitle')}
      headerRight={headerRight()}
      data={upcomingMatches}
      onRefresh={fetchTournamentsHandler}
      fetching={fetching}
      currentID={currentID}
      matchPickedHandler={matchPickedHandler}
      emptyString={t('tournaments:noUpcoming')}
    />
  );
}

export default TournamentsScreen;
