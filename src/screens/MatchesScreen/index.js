import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import CalendarContainer from '@containers/calendar_container';
import {useSelector, useDispatch} from 'react-redux';
import {getMatches, getCountry} from '@stores/selectors';
import {t} from 'i18next';
import moment from 'moment';
import Icon from '@components/atoms/icon';
import {COLORS} from '@theme/colors';
import {TouchableOpacity} from 'react-native';
import {fetchMatch, fetchMatchesByDate} from '@stores/services';

function MatchesScreen(props) {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [endReached, setEndReached] = useState(false);

  const navigation = useNavigation();

  const countryCode = useSelector(getCountry);
  const matches = useSelector(getMatches);

  const today = moment();

  const [selectedDate, setSelectedDate] = useState(today);

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
      if (result === 0) {
        setEndReached(true);
      }
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

  const oneMonthLater = moment().add(1, 'weeks');

  const weekdayBlacklist = [];

  for (let i = 0; i < today.day(); i++) {
    // Add all weekdays before the current day to the blacklist
    weekdayBlacklist.push(moment(today).subtract(i + 1, 'days'));
  }

  const fetchDataByDate = useCallback(date => {
    setEndReached(false);
    setSelectedDate(date);
    setFetching(true);
    new Promise((resolve, reject) => {
      resolve(
        dispatch(fetchMatchesByDate(countryCode, currentPage, new Date(date))),
      );
    }).then(function (result) {
      if (result === 0) {
        setEndReached(true);
      }
      setFetching(false);
    });
  }, []);

  const fetchDataCountByRange = useCallback((start, end) => {
    // console.log([start, end]);
  }, []);

  const headerRight = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('PastMatchesStack', {
            screen: 'PastMatchesScreen',
          });
        }}>
        <Icon name="time-past" color={COLORS.white} size={22} />
      </TouchableOpacity>
    );
  };

  return (
    <CalendarContainer
      title={t('matches:mainTitle')}
      headerRight={headerRight()}
      data={todayMatches}
      refreshing={refreshing}
      fetching={fetching}
      onRefresh={fetchMatchesHandler}
      selectedDate={selectedDate}
      minDate={today}
      maxDate={oneMonthLater}
      onDateSelected={fetchDataByDate}
      currentID={currentID}
      matchPickedHandler={matchPickedHandler}
      onWeekChanged={fetchDataCountByRange}
      datesBlacklist={weekdayBlacklist}
      emptyString={t('matches:noMatchesThisDay')}
    />
  );
}

export default MatchesScreen;
