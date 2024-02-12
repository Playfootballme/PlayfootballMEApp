import {COLORS} from '@theme/colors';
import {METRICS} from '@theme/metrics';
import {Platform} from 'react-native';

export const typography = {
  fontFamily_en: {
    fontFamily: 'Lexend',
  },
  fontFamily_ar: {
    fontFamily: Platform.OS === 'android' ? 'IBM' : 'IBMPlexSansArabic-Regular',
  },
  fontWeight: {
    fw900: {
      fontWeight: '900',
    },
    fw800: {
      fontWeight: '800',
    },
    fw700: {
      fontWeight: '700',
    },
    fw600: {
      fontWeight: '600',
    },
    fw500: {
      fontWeight: '500',
    },
    fw400: {
      fontWeight: '400',
    },
    fw300: {
      fontWeight: '300',
    },
    fw200: {
      fontWeight: '200',
    },
    fw100: {
      fontWeight: '100',
    },
  },

  fontSize: {
    XTiny: {
      fontSize: METRICS.sizeXTiny,
    },
    tiny: {
      fontSize: METRICS.sizeTiny,
    },
    small: {
      fontSize: METRICS.sizeSmall,
    },
    normal: {
      fontSize: METRICS.sizeNormal,
    },
    medium: {
      fontSize: METRICS.sizeMedium,
    },
    compact: {
      fontSize: METRICS.sizeCompact,
    },
    large: {
      fontSize: METRICS.sizeLarge,
    },
    xlarge: {
      fontSize: METRICS.sizeXLarge,
    },
  },

  fontColor: {
    white: {
      color: COLORS.white,
    },
    black: {
      color: COLORS.black,
    },
    grey: {
      color: COLORS.grey,
    },
  },

  underline: {
    textDecorationLine: 'underline',
  },
  textCenter: {
    textAlign: 'center',
  },
};
