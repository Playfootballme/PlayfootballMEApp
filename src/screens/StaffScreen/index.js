import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import ListContainer from '@containers/list_container';
import {useSelector} from 'react-redux';
import {getMe, getCountry} from '@stores/selectors';
import {useDispatch} from 'react-redux';
import {t} from 'i18next';
import {GetStaff} from '@config/functions';
import CustomText from '@components/custom/custom_text';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomImage from '@components/custom/custom_image';
import {styles} from '@styles';
import {rootURL} from '../../config/functions';
import {METRICS} from '../../theme/metrics';
import {COLORS} from '../../theme/colors';

function StaffScreen(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const Me = useSelector(getMe);
  const currentCountry = useSelector(getCountry);
  const onPressBack = () => {
    navigation.goBack();
  };

  const [users, setUsers] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const fetchData = async () => {
    setRefreshing(true);
    const response = await GetStaff(currentCountry, Me?.jwt);
    if (response.status === 200 && response.data.data.length > 0) {
      setUsers(response.data.data);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  let styleArr = [styles.matchThumbnail];
  if (props.style) {
    if (Array.isArray(props.style)) {
      styleArr = [...styleArr, ...props.style];
    } else {
      styleArr = [...styleArr, props.style];
    }
  }

  const renderUser = ({item, index}) => {
    var backgroundImage = item?.Image
      ? {
          uri: rootURL + item?.Image?.url,
        }
      : require('@assets/images/logo-white.png');
    return (
      <TouchableOpacity
        style={[
          {width: '50%'},
          index % 2 === 0 ? {paddingRight: 10} : {paddingLeft: 10},
        ]}
        onPress={props.onPress}>
        <CustomImage
          isBackground={true}
          source={backgroundImage}
          resizeMode={item?.Image ? 'cover' : 'contain'}
          style={styleArr}></CustomImage>
        <CustomText
          style={[
            styles.fontSize.normal,
            styles.fontWeight.fw600,
            {marginBottom: METRICS.spaceTiny},
          ]}>
          {`${item?.FirstName} ${item?.LastName}`}
        </CustomText>
        <CustomText
          style={[
            styles.fontSize.small,
            styles.fontWeight.fw400,
            styles.fontColor.grey,
            {marginBottom: METRICS.spaceSmall},
          ]}>
          {t(`staff:staff${item?.role?.name}Label`)}
        </CustomText>
      </TouchableOpacity>
    );
  };

  return (
    <ListContainer
      title={t('staff:mainTitle')}
      onPressBack={onPressBack}
      data={users}
      renderItem={renderUser}
      numColumns={2}
      refreshHandler={fetchData}
      refreshing={refreshing}
      renderEmptyItem={() => (
        <View style={[styles.container]}>
          <CustomText style={[styles.fontSize.normal, {textAlign: 'center'}]}>
            {t('matches:noPast')}
          </CustomText>
        </View>
      )}
      renderLoadingItem={() => (
        <View style={[styles.container]}>
          <ActivityIndicator color={COLORS.white} size="large" />
        </View>
      )}
      footerComponent={<View style={{height: 50}} />}
    />
  );
}

export default StaffScreen;
