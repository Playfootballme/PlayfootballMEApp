import React, {useMemo, useState, useCallback, useEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {
  getMatches,
  getCountry,
  getAnnouncements,
  getMe,
} from '@stores/selectors';
import {fetchMatch, fetchMatchesByDate} from '@stores/services';
import {t} from 'i18next';
import moment from 'moment';
import {styles} from '@styles';

import HomeContainer from '@containers/home_container';
import {FindNearestMatchDate, FindNearestMatchDates} from '@config/functions';

function HomeScreen(props) {
  // Redux state
  const announcements = useSelector(getAnnouncements);
  const Me = useSelector(getMe);
  const countryCode = useSelector(getCountry);
  const matches = useSelector(getMatches);

  // Redux actions
  const dispatch = useDispatch();

  // Navigation
  const navigation = useNavigation();

  // Component state
  const [refreshing, setRefreshing] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [endReached, setEndReached] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [currentID, setCurrentID] = useState(-1);
  const [currentPage, setCurrentPage] = useState(1);
  const [whiteListedDates, setWhiteListedDates] = useState([]);
  const [blackListedDates, setBlackListedDates] = useState([]);

  const calendarRef = useRef();

  // Helper functions
  const fetchMatchesHandler = () => {
    setFetching(true);
    new Promise((resolve, reject) => {
      resolve(
        dispatch(
          fetchMatchesByDate(countryCode, currentPage, new Date(selectedDate)),
        ),
      );
    }).then(function (result) {
      new Promise((resolve, reject) => {
        resolve(FindNearestMatchDates(countryCode));
      }).then(function (whitleListDates) {
        setWhiteListedDates(whitleListDates);
      });
      if (result === 0) {
        new Promise((resolve, reject) => {
          resolve(FindNearestMatchDate(countryCode));
        }).then(function (nearestDate) {
          const nearestMatchDate = moment(nearestDate);
          if (calendarRef.current) {
            calendarRef.current.setSelectedDate(nearestMatchDate);
          }
        });
      } else {
        setFetching(false);
      }
    });
  };

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

  // Date-related calculations
  const todayMatches = useMemo(() => {
    const nowDate = moment(selectedDate); // Current date and time
    const nowDateString = nowDate.format('DD/MM/YYYY'); // Format to "DD/MM/YYYY"

    return matches.filter(match => {
      const matchEndDateTime = moment(match.EndDate);
      const matchEndDateString = matchEndDateTime.format('DD/MM/YYYY'); // Format to "DD/MM/YYYY"

      return matchEndDateString === nowDateString;
    });
  }, [matches, selectedDate]);

  const oneWeekLater = moment().add(1, 'weeks');

  const daysToCheck = 14;
  const whiteListedSet =
    whiteListedDates.length > 0
      ? new Set(
          whiteListedDates?.map(date => moment(date).format('YYYY-MM-DD')),
        )
      : new Set([]);

  // console.log(whiteListedSet);

  const weekdayBlacklist = [];

  for (let i = 0; i < daysToCheck; i++) {
    const dayBefore = moment().subtract(i, 'days').format('YYYY-MM-DD');
    const dayAfter = moment().add(i, 'days').format('YYYY-MM-DD');
    if (!whiteListedSet.has(dayBefore)) {
      weekdayBlacklist.push(moment(dayBefore));
    }

    if (!whiteListedSet.has(dayAfter)) {
      weekdayBlacklist.push(moment(dayAfter));
    }
  }
  // Component lifecycle
  useEffect(() => {
    fetchMatchesHandler();
  }, []);

  // Component rendering
  return (
    <HomeContainer
      title={t('common:matches')}
      subTitle={` ${t('common:inLabel')} ${t(`joinUs:${countryCode}`)}`}
      calendarRef={calendarRef}
      announcements={announcements}
      data={todayMatches}
      refreshing={refreshing}
      fetching={fetching}
      onRefresh={fetchMatchesHandler}
      selectedDate={selectedDate}
      minDate={
        ['organizer', 'referee'].includes(Me?.data?.role?.type)
          ? null
          : moment()
      }
      maxDate={oneWeekLater}
      onDateSelected={fetchDataByDate}
      currentID={currentID}
      matchPickedHandler={matchPickedHandler}
      datesBlacklist={
        ['organizer', 'referee'].includes(Me?.data?.role?.type)
          ? null
          : weekdayBlacklist
      }
      datesWhiteList={whiteListedDates}
      emptyString={t('matches:noMatchesThisDay')}
    />
  );
}

export default HomeScreen;
