import React, {lazy, useCallback, useEffect, useState} from 'react';
import {
  ScrollView,
  SafeAreaView,
  StatusBar,
  View,
  Linking,
  Platform,
  RefreshControl,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {styles} from '@styles';
import {COLORS} from '@theme/colors';
import HomeHeader from '@components/layout/header/home.js';

import ModalWrapper from '@components/organisms/modal';
import Icon from '@components/atoms/icon';
import CustomText from '@components/custom/custom_text';
import {METRICS} from '@theme/metrics';
import Button from '@components/atoms/button';

import checkVersion from 'react-native-store-version';
import {t} from 'i18next';
import {useSelector, useDispatch} from 'react-redux';
import {getMe, getLanguage} from '@stores/selectors';
import {UpdateDOB} from '@config/functions';
import moment from 'moment';
import {fetchMe} from '@stores/services';
import MatchThumbnail from '@components/custom/match_thumbnail';
import Calendar from '@components/atoms/calendar';
import {enConfig, arConfig} from '@config/moment_locale';

const LazyDatePicker = lazy(() => import('react-native-date-picker'));

function HomeContainer(props) {
  const [refreshing, setRefreshing] = useState(false);
  const [noSkipModal, setNoSkipModal] = useState(false);
  const [dobModal, setDOBModal] = useState(false);
  const [dobValue, setDobValue] = useState(moment());
  const [loading, setLoading] = useState(false);
  const currentLang = useSelector(getLanguage);

  const Me = useSelector(getMe);
  const dispatch = useDispatch();
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      if (props.refreshHandler) {
        props.refreshHandler();
      }
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const check = await checkVersion({
          version: '2.3', // app local version
          iosStoreURL:
            'https://apps.apple.com/us/app/playfootball-me/id6449159354',
          androidStoreURL:
            'https://play.google.com/store/apps/details?id=com.playfootballme',
          country: 'jp', // default value is 'jp'
        });
        if (check.result === 'new') {
          // if app store version is new
          setNoSkipModal(true);
        } else {
          if (Me && Me?.data?.dob === null) {
            new Promise((resolve, reject) => {
              resolve(setDOBModal(true));
            }).then(value => {
              setTimeout(() => setNoSkipModal(true), 500);
            });
          }
        }
      } catch (e) {
        console.log(e);
      }
    };

    init();
  }, []);

  const updateAppHandler = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL(
        'https://apps.apple.com/us/app/playfootball-me/id6449159354',
      ); // open store if update is needed.
    } else {
      Linking.openURL(
        'https://play.google.com/store/apps/details?id=com.playfootballme',
      ); // open store if update is needed.
    }
  };

  const updateDOBHandler = async () => {
    setLoading(true);

    const updateRes = await UpdateDOB(
      Me.data.id,
      Me?.jwt,
      moment(dobValue).locale('en-gb').format('YYYY-MM-DD'),
    );
    if (updateRes.status === 200) {
      dispatch(fetchMe(Me?.jwt));
      setNoSkipModal(!noSkipModal);

      setTimeout(() => {
        setDOBModal(false);
        setLoading(false);
      }, 500);
    } else {
      Alert.alert(t('profile:alertDobTitle'), t('common:somethingWentWrong'), [
        {text: t('common:tryAgain'), onPress: () => setLoading(false)},
      ]);
    }
  };

  const noSkipModalWrapper = (
    <View style={{height: !noSkipModal && 0}}>
      <ModalWrapper
        modalStyle="full"
        isActive={noSkipModal}
        setModalVisible={() => {
          setNoSkipModal(!noSkipModal);
          setDOBModal(false);
        }}>
        <View
          style={[
            styles.container,
            styles.flex,
            {alignItems: 'center', justifyContent: 'center'},
          ]}>
          {dobModal ? (
            <>
              <View>
                <CustomText
                  style={[
                    styles.fontSize.compact,
                    styles.fontWeight.fw600,
                    {marginBottom: METRICS.spaceMedium},
                  ]}>
                  {t('profile:dobTitleUpdate')}
                </CustomText>
              </View>
              <LazyDatePicker
                date={dobValue ? new Date(dobValue) : new Date()}
                onDateChange={setDobValue}
                maximumDate={new Date()}
                androidVariant="iosClone"
                fadeToColor="none"
                mode="date"
                textColor="#fff"
                locale={currentLang}
              />
            </>
          ) : (
            <>
              <View
                style={[
                  styles.modalConfirmIcon,
                  {
                    marginBottom: METRICS.spaceSmall,
                    backgroundColor: COLORS.blue,
                  },
                ]}>
                <Icon name={'refresh'} size={100} color={COLORS.white} />
              </View>
              <CustomText
                style={[
                  styles.fontSize.compact,
                  styles.fontWeight.fw600,
                  {textAlign: 'center', marginBottom: METRICS.spaceTiny},
                ]}>
                {t('home:updateTitle')}
              </CustomText>
              <CustomText
                style={[
                  styles.fontSize.normal,
                  {textAlign: 'center', marginBottom: METRICS.spaceMedium},
                ]}>
                {t('home:updateDesc')}
              </CustomText>
              <View
                style={[
                  styles.rowContainer,
                  styles.alignCenter,
                  styles.justifyCenter,
                  {marginBottom: METRICS.spaceLarge},
                ]}
              />
            </>
          )}

          <Button
            loading={loading && dobModal}
            disabled={loading && dobModal}
            content={t('home:updateButton')}
            onPress={dobModal ? updateDOBHandler : updateAppHandler}
            variant="solid"
            size="normal"
            fullWidth
          />
        </View>
      </ModalWrapper>
    </View>
  );

  const locale = useSelector(getLanguage);
  const localeConfig = {
    name: locale === 'en' ? 'en-gb' : 'ar',
    config: locale === 'en' ? enConfig : arConfig,
  };
  const renderItem = ({item, index}) => {
    const the_item = {
      item: item,
    };

    if (props.fetching) {
      return (
        <View style={[{flex: 1}]}>
          <ActivityIndicator size="large" color={COLORS.white} />
        </View>
      );
    }

    return (
      <View>
        <MatchThumbnail
          onPress={() => props.matchPickedHandler(item.id)}
          item={the_item}
          index={index}
          loading={item.id === props.currentID}
          fullwidth
        />
      </View>
    );
  };

  const renderEmptyItem = (
    <View>
      <CustomText
        style={[
          styles.fontSize.normal,
          {marginBottom: METRICS.spaceMedium, textAlign: 'center'},
        ]}>
        {props.emptyString}
      </CustomText>
    </View>
  );

  const keyExtractor = item => {
    return item.id + Math.random();
  };

  const formatDate = () => {
    let isTodayOrTomorrow = '';

    if (moment(props.selectedDate).isSame(moment(), 'day')) {
      isTodayOrTomorrow = t('common:todayLabel');
    } else if (
      moment(props.selectedDate).isSame(moment().add(1, 'day'), 'day')
    ) {
      isTodayOrTomorrow = t('common:tomorrowLabel');
    }

    if (isTodayOrTomorrow) {
      return `${isTodayOrTomorrow}, ${moment(props.selectedDate).format(
        'dddd, D MMMM, YYYY',
      )}`;
    } else {
      return moment(props.selectedDate).format('dddd, D MMMM, YYYY');
    }
  };

  return (
    <SafeAreaView style={[styles.flex, styles.darkBackground]}>
      <StatusBar
        animated={false}
        backgroundColor={COLORS.black}
        barStyle="light-content"
      />
      <HomeHeader
        announcements={props.announcements}
        title={props.title}
        subTitle={props.subTitle}
      />
      <View style={styles.flex}>
        <View
          style={{
            marginBottom: METRICS.spaceTiny,
          }}>
          <Calendar
            calendarRef={props.calendarRef}
            maxDate={props.maxDate}
            minDate={props.minDate}
            selectedDate={props.selectedDate}
            onDateSelected={props.onDateSelected}
            onWeekChanged={props.onWeekChanged}
            datesBlacklist={props.datesBlacklist}
            datesWhiteList={props.datesWhiteList}
            locale={localeConfig}
          />
        </View>

        <View style={[styles.flex, styles.container]}>
          <View style={{marginBottom: METRICS.spaceNormal}}>
            <CustomText>{formatDate()}</CustomText>
          </View>
          <FlatList
            style={styles.flex}
            ItemSeparatorComponent={() => <View style={{height: 10}} />}
            data={props.fetching ? [1] : props.data}
            renderItem={renderItem}
            ListEmptyComponent={renderEmptyItem}
            keyExtractor={keyExtractor}
            initialNumToRender={10} // Render the first 10 items initially
            maxToRenderPerBatch={5} // Number of items to render in each batch
            windowSize={10} // Number of items to keep in memory above and below the viewport
            refreshControl={
              <RefreshControl
                colors={[COLORS.white]}
                size="large"
                refreshing={props.refreshing}
                onRefresh={props.onRefresh}
                tintColor={COLORS.white}
              />
            }
          />
        </View>
      </View>
      {noSkipModalWrapper}
    </SafeAreaView>
  );
}

export default HomeContainer;
