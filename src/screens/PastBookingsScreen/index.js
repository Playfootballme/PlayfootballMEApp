import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

import {View} from 'react-native';
import HeroContainer from '@containers/hero_container';
import List from '@components/organisms/list';
import BookingThumbnail from '@components/custom/booking_thumbnail';
import {METRICS} from '@theme/metrics';
import {useSelector, useDispatch} from 'react-redux';
import {styles} from '@styles';
import {getPastMatches, getCountry, getMe} from '@stores/selectors';

import moment from 'moment';
import CustomText from '@components/custom/custom_text';
import {t} from 'i18next';

function PastBookingsScreen(props) {
  const dispatch = useDispatch();
  const countryCode = useSelector(getCountry);
  const navigation = useNavigation();
  const Me = useSelector(getMe);

  const matches = useSelector(getPastMatches);

  const myBookings = matches.filter(match => {
    return match.attributes.Players.find(player => {
      return player.Player?.data?.id === Me.data.id;
    });
  });
  const pastBookings = myBookings.filter(match => {
    const today = moment();
    const EndDate = moment(match?.attributes.EndDate);
    return today.isAfter(EndDate);
  });

  const matchPickedHandler = matchID => {
    navigation.navigate('MatchStack', {
      screen: 'MatchScreen',
      params: {matchID: matchID, isPast: true},
    });
  };

  const onPressBack = () => {
    navigation.goBack();
  };

  return (
    <HeroContainer
      title={t('profile:pastBookingsMainTitle')}
      onPressBack={onPressBack}>
      <List
        data={pastBookings}
        renderItem={(item, index) => (
          <View style={styles.flex}>
            <BookingThumbnail
              onPress={() => matchPickedHandler(item.item.id)}
              item={item}
              index={index}
            />
          </View>
        )}
        renderEmptyItem={() => (
          <View style={[styles.container]}>
            <CustomText style={[styles.fontSize.normal, {textAlign: 'center'}]}>
              {t('profile:emptyBookings')}
            </CustomText>
          </View>
        )}
        style={{
          marginHorizontal: METRICS.spaceMedium,
        }}
      />
    </HeroContainer>
  );
}

export default PastBookingsScreen;
