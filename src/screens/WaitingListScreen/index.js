import React from 'react';
import {useNavigation} from '@react-navigation/native';

import {View} from 'react-native';
import HeroContainer from '@containers/hero_container';
import List from '@components/organisms/list';
import BookingThumbnail from '@components/custom/booking_thumbnail';
import {METRICS} from '@theme/metrics';
import {useSelector} from 'react-redux';
import {styles} from '@styles';
import {getMatches, getPickups, getMe} from '@stores/selectors';
import moment from 'moment';
import CustomText from '@components/custom/custom_text';
import {t} from 'i18next';

function WaitingListScreen(props) {
  const navigation = useNavigation();
  const Me = useSelector(getMe);
  const matches = useSelector(getMatches);

  const myBookings = matches.filter(match => {
    return match?.attributes?.WaitingList.find(player => {
      return player?.Player?.data?.id === Me.data.id;
    });
  });
  const currentBookings = myBookings.filter(match => {
    const today = moment();
    const EndDate = moment(match?.attributes.EndDate);
    return EndDate.isAfter(today);
  });

  const matchPickedHandler = matchID => {
    navigation.navigate('MatchStack', {
      screen: 'MatchScreen',
      params: {matchID},
    });
  };

  const onPressBack = () => {
    navigation.goBack();
  };

  return (
    <HeroContainer
      title={t('profile:waitingListMainTitle')}
      onPressBack={onPressBack}>
      <List
        data={currentBookings}
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

export default WaitingListScreen;
