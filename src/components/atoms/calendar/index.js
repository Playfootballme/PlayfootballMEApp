import React, {PureComponent, lazy, Suspense} from 'react';
import {View, I18nManager, Platform} from 'react-native';
import {COLORS} from '@theme/colors';
import {METRICS} from '../../../theme/metrics';
import moment from 'moment';

const CalendarStrip = lazy(() => import('react-native-calendar-strip'));

class Calendar extends PureComponent {
  iconLeftDir() {
    if (I18nManager.isRTL) {
      return require('./angle-small-right.png');
    } else {
      return require('./angle-small-left.png');
    }
  }

  iconRightDir() {
    if (I18nManager.isRTL) {
      return require('./angle-small-left.png');
    } else {
      return require('./angle-small-right.png');
    }
  }

  componentDidCatch(error, errorInfo) {
    console.log('error', error);
    console.log('errorInfo', errorInfo);
  }

  render() {
    const {
      minDate,
      maxDate,
      selectedDate,
      onWeekChanged,
      onDateSelected,
      datesBlacklist,
      locale,
      calendarRef,
      datesWhiteList,
    } = this.props;

    const markedDatesArray =
      datesWhiteList.length > 0
        ? datesWhiteList?.map(matchDate => {
            return {
              date: moment(matchDate),
              dots: [
                {
                  color: COLORS.backgroundBlue,
                  selectedColor: COLORS.white,
                },
              ],
            };
          })
        : [];
    return (
      <View>
        <Suspense fallback={null}>
          <CalendarStrip
            ref={calendarRef}
            scrollable={!(Platform.OS === 'android' && I18nManager.isRTL)}
            style={{height: 75}}
            locale={locale}
            minDate={minDate}
            maxDate={maxDate}
            showMonth={false}
            selectedDate={selectedDate}
            onWeekChanged={onWeekChanged}
            onDateSelected={onDateSelected}
            calendarColor={COLORS.black}
            calendarHeaderStyle={{color: COLORS.white}}
            dateNumberStyle={{color: COLORS.white}}
            dateNameStyle={{color: COLORS.white}}
            highlightDateContainerStyle={{
              backgroundColor: COLORS.backgroundBlue,
              borderRadius: METRICS.borderRadiusMedium,
            }}
            disabledDateNameStyle={{color: COLORS.grey}}
            disabledDateNumberStyle={{color: COLORS.grey}}
            highlightDateNumberStyle={{color: COLORS.white}}
            highlightDateNameStyle={{color: COLORS.white}}
            iconContainer={{flex: 0.1}}
            iconLeft={this.iconLeftDir()}
            iconRight={this.iconRightDir()}
            datesBlacklist={datesBlacklist}
            markedDates={markedDatesArray}
          />
        </Suspense>
      </View>
    );
  }
}

export default Calendar;
