import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import {View} from 'react-native';
import HeroContainer from '@containers/hero_container';
import List from '@components/organisms/list';
import PickupThumbnail from '@components/custom/pickup_thumbnail';
import {METRICS} from '@theme/metrics';
import {useSelector, useDispatch} from 'react-redux';
import {} from '@stores/selectors';
import {getPickups, getCountry, getPastPickups} from '@stores/selectors';

import {styles} from '@styles';
import CustomText from '@components/custom/custom_text';
import {
  fetchUpcomingPickups,
  fetchRegisteredPlayersOfPickup,
} from '@stores/services';
import {useStateIfMounted} from 'use-state-if-mounted';

import Button from '@components/atoms/button';

function PickupsScreen(props) {
  const [currentID, setCurrentID] = useState(-1);
  const navigation = useNavigation();
  const upcomingPickups = useSelector(getPickups);
  const pastPickups = useSelector(getPastPickups);
  const countryCode = useSelector(getCountry);
  const dispatch = useDispatch();

  const pickupPickedHandler = pickupID => {
    setCurrentID(pickupID);
    const res = dispatch(fetchRegisteredPlayersOfPickup(countryCode, pickupID));
    res.then(data => {
      setCurrentID(-1);
      if (data === 200) {
        navigation.navigate('PickupStack', {
          screen: 'PickupScreen',
          params: {pickupID},
        });
      }
    });
  };

  const [refreshing, setRefreshing] = useStateIfMounted(false);

  return (
    <HeroContainer
      title="Upcoming Tournaments"
      refreshHandler={() => {
        setRefreshing(true);
        const res = dispatch(fetchUpcomingPickups(countryCode));
        res.then(data => {
          if (data) {
            setRefreshing(false);
          }
        });
      }}
      refreshing={refreshing}>
      <List
        data={upcomingPickups}
        renderEmptyItem={() => (
          <View style={[styles.container]}>
            <CustomText style={[styles.fontSize.normal, {textAlign: 'center'}]}>
              There are no upcoming Tournaments
            </CustomText>
          </View>
        )}
        renderItem={(item, index) => (
          <View style={{marginBottom: METRICS.spaceMedium}}>
            <PickupThumbnail
              onPress={() => pickupPickedHandler(item.item.id)}
              item={item}
              index={index}
              loading={item?.item?.id === currentID}
            />
          </View>
        )}
        style={{
          marginHorizontal: METRICS.spaceMedium,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          flex: 1,
        }}
      />

      {pastPickups.length > 0 && (
        <View style={[styles.container, {marginBottom: METRICS.spaceXXLarge}]}>
          <Button
            content={'Load Past Matches'}
            onPress={() => {
              navigation.navigate('PastMatchesStack', {
                screen: 'PastMatchesScreen',
              });
            }}
            variant="solid"
            size="normal"
            fullWidth
          />
        </View>
      )}
    </HeroContainer>
  );
}

export default PickupsScreen;
