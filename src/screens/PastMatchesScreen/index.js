import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import CalendarContainer from '@containers/calendar_container';
import {useSelector, useDispatch} from 'react-redux';
import {getMatches, getCountry} from '@stores/selectors';
import {fetchTodayAndTomorrowMatches} from '@stores/services';
import {t} from 'i18next';
import moment from 'moment';
import {fetchMatch, fetchMatchesByDate} from '@stores/services';

function PastMatchesScreen(props) {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [fetching, setFetching] = useState(false);

  const navigation = useNavigation();

  const countryCode = useSelector(getCountry);
  const matches = useSelector(getMatches);

  const yesterday = moment().subtract(1, 'days');

  const [selectedDate, setSelectedDate] = useState(yesterday);

  const todayMatches = useMemo(() => {
    const nowDate = moment(selectedDate); // Current date and time
    const nowDateString = nowDate.format('DD/MM/YYYY'); // Format to "DD/MM/YYYY"

    return matches.filter(match => {
      const matchEndDateTime = moment(match.EndDate);
      const matchEndDateString = matchEndDateTime.format('DD/MM/YYYY'); // Format to "DD/MM/YYYY"

      return matchEndDateString === nowDateString;
    });
  }, [matches, selectedDate]);

  const [currentID, setCurrentID] = useState(-1);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchMatchesHandler = () => {
    if (todayMatches.length === 0) {
      setFetching(true);
    } else {
      setRefreshing(true);
    }
    new Promise((resolve, reject) => {
      resolve(
        dispatch(
          fetchMatchesByDate(countryCode, currentPage, new Date(selectedDate)),
        ),
      );
    }).then(function (result) {
      setFetching(false);
      setRefreshing(false);
    });
  };
  useEffect(() => {
    fetchMatchesHandler();
  }, []);

  const matchPickedHandler = matchID => {
    setCurrentID(matchID);
    new Promise(function (resolve, reject) {
      resolve(dispatch(fetchMatch(matchID)));
    }).then(function (result) {
      setCurrentID(-1);
      navigation.navigate('MatchStack', {
        screen: 'MatchScreen',
        params: {matchID},
      });
    });
  };

  const fetchDataByDate = useCallback(date => {
    setSelectedDate(date);
    setFetching(true);
    new Promise((resolve, reject) => {
      resolve(
        dispatch(fetchMatchesByDate(countryCode, currentPage, new Date(date))),
      );
    }).then(function (result) {
      setFetching(false);
    });
  }, []);

  const fetchDataCountByRange = useCallback((start, end) => {
    // console.log([start, end]);
  }, []);
  const onPressBack = () => {
    navigation.goBack();
  };
  return (
    <CalendarContainer
      title={t('matches:pastMainTitle')}
      onPressBack={onPressBack}
      refreshHandler={() => {
        setRefreshing(true);
        const res = dispatch(fetchTodayAndTomorrowMatches(countryCode, 1));
        res.then(data => {
          if (data) {
            setRefreshing(false);
          }
        });
      }}
      data={todayMatches}
      onRefresh={fetchMatchesHandler}
      refreshing={refreshing}
      fetching={fetching}
      selectedDate={selectedDate}
      maxDate={yesterday}
      onDateSelected={fetchDataByDate}
      currentID={currentID}
      matchPickedHandler={matchPickedHandler}
      onWeekChanged={fetchDataCountByRange}
      emptyString={t('matches:noMatchesThisDay')}
    />
  );
}

export default PastMatchesScreen;
