export const enConfig = {
  months:
    'January_February_March_April_May_June_July_August_September_October_November_December'.split(
      '_',
    ),
  monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
  weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split(
    '_',
  ),
  weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
  weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
  longDateFormat: {
    LT: 'h:mm A',
    LTS: 'h:mm:ss A',
    L: 'MM/DD/YYYY',
    LL: 'MMMM D, YYYY',
    LLL: 'MMMM D, YYYY h:mm A',
    LLLL: 'dddd, MMMM D, YYYY h:mm A',
  },
  calendar: {
    sameDay: '[Today at] LT',
    nextDay: '[Tomorrow at] LT',
    nextWeek: 'dddd [at] LT',
    lastDay: '[Yesterday at] LT',
    lastWeek: 'dddd [at] LT',
    sameElse: 'L',
  },
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'a few seconds',
    m: 'a minute',
    mm: '%d minutes',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years',
  },
  ordinalParse: /\d{1,2}(th|st|nd|rd)/,
  ordinal: function (number) {
    const b = number % 10;
    const output =
      ~~((number % 100) / 10) === 1
        ? 'th'
        : b === 1
        ? 'st'
        : b === 2
        ? 'nd'
        : b === 3
        ? 'rd'
        : 'th';
    return number + output;
  },
  meridiemParse: /AM|PM/i,
  isPM: function (input) {
    return input.charAt(0) === 'P' || input.charAt(0) === 'p';
  },
  meridiem: function (hours, minutes, isLower) {
    if (hours < 12) {
      return 'AM';
    } else {
      return 'PM';
    }
  },
  week: {
    dow: 0, // Sunday is the first day of the week.
    doy: 4, // The week that contains Jan 4th is the first week of the year.
  },
};

export const arConfig = {
  months:
    'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split(
      '_',
    ),
  monthsShort:
    'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split(
      '_',
    ),
  monthsParseExact: true,
  weekdays: 'الأحد_الاثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
  weekdaysShort: 'الأحد_الاثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split(
    '_',
  ),
  weekdaysMin: 'أحد_اثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'h:mm A',
    LTS: 'h:mm:ss A',
    L: 'MM/DD/YYYY',
    LL: 'MMMM D, YYYY',
    LLL: 'MMMM D, YYYY h:mm A',
    LLLL: 'dddd, MMMM D, YYYY h:mm A',
  },
  calendar: {
    sameDay: '[اليوم في] LT',
    nextDay: '[غدا في] LT',
    nextWeek: 'dddd [في] LT',
    lastDay: '[أمس في] LT',
    lastWeek: 'dddd [الماضي في] LT',
    sameElse: 'L',
  },
  relativeTime: {
    future: 'في %s',
    past: 'منذ %s',
    s: 'ثواني قليلة',
    m: 'دقيقة واحدة',
    mm: '%d دقائق',
    h: 'ساعة واحدة',
    hh: '%d ساعات',
    d: 'يوم واحد',
    dd: '%d أيام',
    M: 'شهر واحد',
    MM: '%d أشهر',
    y: 'عام واحد',
    yy: '%d أعوام',
  },
  dayOfMonthOrdinalParse: /\d{1,2}(ي|ى)/,
  ordinal: function (number) {
    return number + (number === 1 ? 'ي' : 'ى');
  },
  meridiemParse: /ص|م/,
  isPM: function (input) {
    return input === 'مساءً';
  },
  meridiem: function (hours, minutes, isLower) {
    return hours >= 12 ? 'مساءً' : 'صباحًا';
  },
  week: {
    dow: 0, // Sunday is the first day of the week.
    doy: 4, // Used to determine the first week of the year.
  },
};
