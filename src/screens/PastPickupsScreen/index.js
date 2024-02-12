import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import {View} from 'react-native';
import HeroContainer from '@containers/hero_container';
import List from '@components/organisms/list';
import MatchThumbnail from '@components/custom/match_thumbnail';
import {METRICS} from '@theme/metrics';
import {useSelector, useDispatch} from 'react-redux';
import {getPastMatches, getCountry} from '@stores/selectors';
import CustomText from '@components/custom/custom_text';
import {styles} from '@styles';

import {useStateIfMounted} from 'use-state-if-mounted';

function PastPickupsScreen(props) {
  const [currentID, setCurrentID] = useState(-1);
  const navigation = useNavigation();
  const pastMatches = useSelector(getPastMatches);
  const countryCode = useSelector(getCountry);
  const dispatch = useDispatch();
  const matchPickedHandler = matchID => {
    navigation.navigate('PickupStack', {
      screen: 'PickupScreen',
      params: {matchID: matchID, isPast: true},
    });
  };

  const [refreshing, setRefreshing] = useStateIfMounted(false);
  const onPressBack = () => {
    navigation.goBack();
  };
  return (
    <HeroContainer
      title="Past Tournaments"
      onPressBack={onPressBack}
      refreshing={refreshing}>
      <List
        data={pastMatches}
        renderItem={(item, index) => (
          <View style={{marginBottom: METRICS.spaceMedium}}>
            <MatchThumbnail
              onPress={() => matchPickedHandler(item.item.id)}
              item={item}
              index={index}
              loading={item?.item?.id === currentID}
            />
          </View>
        )}
        renderEmptyItem={() => (
          <View style={[styles.container]}>
            <CustomText style={[styles.fontSize.normal, {textAlign: 'center'}]}>
              There are no upcoming Tournaments
            </CustomText>
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
    </HeroContainer>
  );
}

export default PastPickupsScreen;
