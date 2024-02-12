import React, {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import BlankContainer from '@containers/blank_container';

import {METRICS} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import {styles} from '@styles';
import {
  FlatList,
  I18nManager,
  Image,
  Linking,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomText from '@components/custom/custom_text';

import Icon from '@components/atoms/icon';

import {useSelector, useDispatch} from 'react-redux';

import {rootURL} from '@config/functions';

import {getLanguage} from '@stores/selectors';

import {t} from 'i18next';
import FastImage from 'react-native-fast-image';
function MatchScreen(props) {
  const navigation = useNavigation();
  const {field} = props.route.params;
  const currentLang = useSelector(getLanguage);
  const [modalIsActive, setModalIsActive] = useState(false);

  const facilitiesIcons = [];

  const modalSwiperRef = useRef(null);

  for (const key in field?.attributes.Facilities) {
    if (field?.attributes.Facilities[key]) {
      if (key !== 'id') {
        facilitiesIcons.push(
          <View
            style={[styles.card, {paddingVertical: 4, paddingHorizontal: 11}]}
            key={key}>
            <View style={[styles.rowContainer, styles.alignCenter]}>
              <Icon name={key.toLowerCase()} size={16} color={COLORS.white} />
              <CustomText
                style={[styles.fontSize.tiny, {marginLeft: METRICS.spaceTiny}]}>
                {t(`matches:${key.toLocaleLowerCase()}`)}
              </CustomText>
            </View>
          </View>,
        );
      }
    }
  }

  const onPressBack = () => {
    navigation.goBack();
  };

  var backgroundImage = field?.attributes?.Image?.data
    ? {
        uri:
          rootURL +
          field?.attributes?.Image?.data?.attributes.formats?.small?.url,
      }
    : require('@assets/images/FootballField1.png');

  const keyExtractor = (item, index) => {
    return index;
  };

  const renderPhoto = ({item, index}) => {
    if (Platform.OS === 'android') {
      return (
        <TouchableOpacity
          onPress={() => {
            setModalIsActive(true);
            setTimeout(() => {
              console.log(modalSwiperRef);
              modalSwiperRef?.current?.scrollToIndex({index: index});
            }, 300);
          }}>
          <Image
            style={styles.photoAlbum}
            source={{uri: rootURL + item?.attributes?.formats.small.url}}
            resizeMode={'cover'}
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => {
            setModalIsActive(true);
            setTimeout(() => {
              modalSwiperRef?.current?.scrollToIndex({index: index});
            }, 300);
          }}>
          <FastImage
            style={styles.photoAlbum}
            source={{uri: rootURL + item?.attributes?.formats.small.url}}
            resizeMode={'cover'}
          />
        </TouchableOpacity>
      );
    }
  };

  const renderFullPhoto = ({item, index}) => {
    console.log(item?.attributes);
    if (Platform.OS === 'android') {
      return (
        <View style={{alignItems: 'center'}}>
          <Image
            style={styles.photoAlbumFull}
            source={{uri: rootURL + item?.attributes?.url}}
            resizeMode={'cover'}
          />
          <View style={{marginTop: METRICS.spaceSmall}}>
            <CustomText>{item?.attributes?.alternativeText}</CustomText>
          </View>
        </View>
      );
    } else {
      return (
        <View style={{alignItems: 'center'}}>
          <FastImage
            style={styles.photoAlbumFull}
            source={{uri: rootURL + item?.attributes?.url}}
            resizeMode={'cover'}
          />
          <View style={{marginTop: METRICS.spaceSmall}}>
            <CustomText>{item?.attributes?.alternativeText}</CustomText>
          </View>
        </View>
      );
    }
  };
  const modalBody = (
    <View style={{flex: 1, paddingVertical: 30, alignItems: 'flex-start'}}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => setModalIsActive(false)}>
          <Icon name="close" size={25} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          alignItems: 'center',
        }}>
        <FlatList
          ref={modalSwiperRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={field?.attributes?.Album?.data}
          renderItem={renderFullPhoto}
          keyExtractor={keyExtractor}
          contentContainerStyle={{gap: 10}}
        />
      </View>
    </View>
  );

  return (
    <BlankContainer
      onPressBack={onPressBack}
      modalIsActive={modalIsActive}
      setModalIsActive={setModalIsActive}
      modalStyle={'full'}
      modalBody={modalBody}>
      <View
        style={{
          position: 'relative',
          height: 200,
          width: '100%',
          marginBottom: METRICS.spaceMedium,
        }}>
        <RenderImage source={backgroundImage} />
        <View style={styles.overlayDark} />

        <View
          style={[
            styles.container,
            {position: 'absolute', top: METRICS.spaceMedium},
          ]}>
          <TouchableOpacity onPress={onPressBack}>
            <Icon
              name={`angle-small-${I18nManager.isRTL ? 'right' : 'left'}`}
              size={25}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>

        <View style={[{position: 'absolute', bottom: 20}, styles.container]}>
          <CustomText
            style={[styles.fontSize.compact, styles.fontWeight.ft700]}>
            {currentLang === 'ar'
              ? field?.attributes?.NameAR
                ? field?.attributes?.NameAR
                : field?.attributes?.Name
              : field?.attributes?.Name}
          </CustomText>
          <CustomText
            style={[
              styles.fontSize.normal,
              styles.fontWeight.fw400,
              styles.fontColor.grey,
              {marginTop: METRICS.spaceTiny},
            ]}>
            {t(`matches:${field?.attributes.Type?.toLowerCase()}`)}
          </CustomText>
        </View>
      </View>

      <View style={[styles.container]}>
        <View style={styles.modalRow}>
          <View style={[styles.rowContainer, styles.alignCenter]}>
            <Icon name="bench-tree" size={20} color={COLORS.white} />
            <CustomText
              style={[styles.fontSize.normal, {marginLeft: METRICS.spaceTiny}]}>
              {t('matches:cityLabel')}
            </CustomText>
          </View>
          <View
            style={{alignItems: 'flex-end'}}
            onPress={() => Linking.openURL(field?.attributes?.GoogleMapLink)}>
            <CustomText style={[styles.fontSize.normal]}>
              {currentLang === 'ar'
                ? field?.attributes?.CityAR
                  ? field?.attributes?.CityAR
                  : field?.attributes?.City
                : field?.attributes?.City}
            </CustomText>
          </View>
        </View>
        {field?.attributes?.GoogleMapLink && (
          <View style={styles.modalRow}>
            <View style={[styles.rowContainer, styles.alignCenter]}>
              <Icon name="map-marker" size={20} color={COLORS.white} />
              <CustomText
                style={[
                  styles.fontSize.normal,
                  {marginLeft: METRICS.spaceTiny},
                ]}>
                {t('matches:directionsLabel')}
              </CustomText>
            </View>
            <TouchableOpacity
              style={{alignItems: 'flex-end'}}
              onPress={() => Linking.openURL(field?.attributes?.GoogleMapLink)}>
              <CustomText style={[styles.fontSize.normal]}>
                {t('matches:viewOnMapLabel')}
              </CustomText>
            </TouchableOpacity>
          </View>
        )}

        {facilitiesIcons.length > 0 && (
          <View
            style={[
              styles.modalRow,
              styles.alignStart,
              {flexDirection: 'column'},
            ]}>
            <View
              style={[
                styles.rowContainer,
                styles.flex,
                {flexWrap: 'wrap', gap: 10},
              ]}>
              {facilitiesIcons}
            </View>
          </View>
        )}

        {field?.attributes?.Album?.data && (
          <View style={[styles.modalRowColumn]}>
            <View
              style={[
                styles.rowContainer,
                styles.alignCenter,
                {marginBottom: METRICS.spaceSmall},
              ]}>
              <Icon name="picture" size={20} color={COLORS.white} />
              <CustomText
                style={[
                  styles.fontSize.normal,
                  {marginLeft: METRICS.spaceTiny},
                ]}>
                {t('matches:photoAlbumLabel')}
              </CustomText>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={field?.attributes?.Album?.data}
              renderItem={renderPhoto}
              keyExtractor={keyExtractor}
              contentContainerStyle={{gap: 10}}
            />
          </View>
        )}
      </View>
    </BlankContainer>
  );
}

export const RenderImage = ({source}) => {
  if (Platform.OS === 'android') {
    return (
      <Image
        style={styles.fieldHeroImage}
        source={source}
        resizeMode={'cover'}
      />
    );
  } else {
    return (
      <FastImage
        style={styles.fieldHeroImage}
        source={source}
        resizeMode={'cover'}
      />
    );
  }
};

export default MatchScreen;
