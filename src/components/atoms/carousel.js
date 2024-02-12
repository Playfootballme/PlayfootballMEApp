import React, {useRef, useState, useEffect} from 'react';
import {
  FlatList,
  View,
  TouchableOpacity,
  Dimensions,
  I18nManager,
  Platform,
  Linking,
  ActivityIndicator,
} from 'react-native';

import CustomImage from '@components/custom/custom_image';
import {rootURL} from '@config/functions';
import {useNavigation} from '@react-navigation/native';
import {METRICS} from '@theme/metrics';
import {useDispatch, useSelector} from 'react-redux';
import {fetchUpcomingTournaments, fetchTournament} from '@stores/services';
import {getCountry, getTournaments} from '@stores/selectors';
import {COLORS} from '@theme/colors';

// import Carousel from 'react-native-basic-carousel';

const CustomCarousel = props => {
  const dispatch = useDispatch();
  const countryCode = useSelector(getCountry);
  const tournaments = useSelector(getTournaments);

  const {width} = Dimensions.get('window');
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(-1);
  const _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        disabled={item.attributes.RouteType === 'None' || loading === index}
        style={{
          width: width / 1.5,
          marginRight: METRICS.spaceSmall,
          borderRadius: METRICS.borderRadius,
          overflow: 'hidden',
          position: 'relative',
        }}
        onPress={() => {
          switch (item.attributes.RouteType) {
            case 'Tournament':
              setLoading(index);
              const existingTournament = tournaments.find(
                tournament => tournament.id === item.attributes.TournamentID,
              );

              if (existingTournament) {
                // If the tournament already exists in the Redux state, navigate to it
                new Promise(function (resolve, reject) {
                  resolve(
                    dispatch(fetchTournament(item.attributes.TournamentID)),
                  );
                }).then(function (result) {
                  setLoading(-1);
                  navigation.navigate('TournamentStack', {
                    screen: 'TournamentScreen',
                    params: {matchID: item.attributes.TournamentID},
                  });
                });
              } else {
                // If the tournament doesn't exist, fetch upcoming tournaments and then navigate
                new Promise((resolve, reject) => {
                  resolve(dispatch(fetchUpcomingTournaments(countryCode, 1)));
                }).then(function (result) {
                  new Promise(function (resolve, reject) {
                    resolve(
                      dispatch(fetchTournament(item.attributes.TournamentID)),
                    );
                  }).then(function (result) {
                    setLoading(-1);
                    navigation.navigate('TournamentStack', {
                      screen: 'TournamentScreen',
                      params: {matchID: item.attributes.TournamentID},
                    });
                  });
                });
              }
              break;

            case 'Body':
              navigation.navigate('AnnouncementStack', {
                screen: 'AnnouncementScreen',
                params: {
                  ID: item.id, // Replace with the actual value you want to pass
                },
              });
              break;

            default:
              Linking.openURL(item.attributes.URL);
              break;
          }
        }}>
        <CustomImage
          style={{
            width: '100%',
            height: 100,
          }}
          resizeMode="cover"
          source={{
            uri: `${rootURL}${item?.attributes?.Image?.data?.attributes?.url}`,
          }}
        />
        {loading === index && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator color={COLORS.white} size="large" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (flatListRef.current) {
        const newIndex = (currentIndex + 1) % props.data.length; // Increment currentIndex before using modulus
        flatListRef.current.scrollToIndex({
          index:
            I18nManager.isRTL && Platform.OS === 'ios'
              ? props.data.length - 1 - newIndex
              : newIndex,
          animated: true,
        });
        setCurrentIndex(newIndex);
      }
    }, 3000); // 3 seconds interval for autoplay

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={props.data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={_renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={event => {
          const contentOffset = event.nativeEvent.contentOffset.x;
          const index = Math.round(
            contentOffset / event.nativeEvent.layoutMeasurement.width,
          );
          setCurrentIndex(index);
        }}
      />
    </View>
  );
};

export default CustomCarousel;
