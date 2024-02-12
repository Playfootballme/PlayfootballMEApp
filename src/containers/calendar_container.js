import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  FlatList,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {styles} from '@styles';
import {COLORS} from '@theme/colors';
import HeroHeader from '@components/layout/header/hero.js';
import MatchThumbnail from '@components/custom/match_thumbnail';
import Calendar from '@components/atoms/calendar';
import {METRICS} from '@theme/metrics';
import CustomText from '@components/custom/custom_text';
import {getLanguage} from '@stores/selectors';

import {t} from 'i18next';
import {useSelector} from 'react-redux';
import {enConfig, arConfig} from '@config/moment_locale';

import moment from 'moment';
function CalendarContainer(props) {
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
      <View
        style={[
          {flex: 0.5},
          index % 2 === 0 ? {marginRight: 7} : {marginLeft: 7},
        ]}>
        <MatchThumbnail
          onPress={() => props.matchPickedHandler(item.id)}
          item={the_item}
          index={index}
          loading={item.id === props.currentID}
        />
      </View>
    );
  };

  const renderEmptyItem = (
    <View style={[styles.container]}>
      <CustomText style={[styles.fontSize.normal, {textAlign: 'center'}]}>
        {props.emptyString}
      </CustomText>
    </View>
  );

  const keyExtractor = item => {
    return item.id;
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
      <HeroHeader
        title={props.title}
        onPressBack={props.onPressBack}
        headerRight={props.headerRight}
      />
      <View style={{marginBottom: METRICS.spaceNormal}}>
        <Calendar
          maxDate={props.maxDate}
          minDate={props.minDate}
          selectedDate={props.selectedDate}
          onDateSelected={props.onDateSelected}
          onWeekChanged={props.onWeekChanged}
          datesBlacklist={props.datesBlacklist}
          locale={localeConfig}
        />
      </View>

      <View style={[styles.flex, styles.container]}>
        <View style={{marginBottom: METRICS.spaceNormal}}>
          <CustomText>{formatDate()}</CustomText>
        </View>
        <FlatList
          style={styles.flex}
          numColumns={2}
          ItemSeparatorComponent={() => <View style={{height: 10}} />}
          data={props.fetching ? [1] : props.data}
          columnWrapperStyle={{
            flex: 1,
          }}
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
    </SafeAreaView>
  );
}

export default CalendarContainer;
