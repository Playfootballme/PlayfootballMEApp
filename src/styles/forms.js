import {METRICS} from '@theme/metrics';
import {COLORS} from '@theme/colors';

export const forms = {
  //button
  button: {
    borderRadius: METRICS.borderRadiusMedium,
    borderWidth: 1,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    overflow: 'hidden',

    disabled: {
      backgroundColor: COLORS.grey2,
      borderColor: COLORS.grey2,
    },

    style: {
      solid: {
        backgroundColor: COLORS.white,
        borderColor: COLORS.white,
        text: {
          color: COLORS.black,
        },
      },
      outline: {
        backgroundColor: COLORS.black,
        borderColor: COLORS.white,
        text: {
          color: COLORS.white,
        },
      },

      link: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        text: {
          color: COLORS.white,
        },
      },

      cancel: {
        backgroundColor: COLORS.backgroundIconRed,
        borderColor: COLORS.backgroundIconRed,
        text: {
          color: COLORS.red,
        },
      },
      cancelText: {
        text: {
          color: COLORS.red,
        },
      },

      waiting: {
        backgroundColor: COLORS.backgroundYellow,
        borderColor: COLORS.backgroundYellow,
        text: {
          color: COLORS.black,
        },
      },

      delete: {
        backgroundColor: COLORS.red,
        borderColor: COLORS.red,
        text: {
          color: COLORS.white,
        },
      },

      adding: {
        backgroundColor: COLORS.blue,
        borderColor: COLORS.blue,
        text: {
          color: COLORS.white,
        },
      },
    },
    size: {
      tiny: {
        paddingVertical: METRICS.spaceTiny,
        paddingHorizontal: METRICS.spaceSmall,
        text: {
          fontSize: METRICS.sizeTiny,
          fontWeight: '600',
        },
      },
      small: {
        paddingVertical: METRICS.spaceTiny,
        paddingHorizontal: METRICS.spaceNormal,
        text: {
          fontSize: METRICS.sizeSmall,
          fontWeight: '600',
        },
      },
      compact: {
        paddingVertical: METRICS.spaceXSmall,
        paddingHorizontal: METRICS.spaceSmall,
        text: {
          fontSize: METRICS.sizeSmall,
          fontWeight: '600',
        },
      },
      normal: {
        paddingVertical: METRICS.spaceNormal,
        paddingHorizontal: METRICS.spaceMedium,
        text: {
          fontSize: METRICS.sizeNormal,
          fontWeight: '600',
        },
      },
    },

    noPadding: {
      paddingVertical: METRICS.spaceTiny,
      paddingHorizontal: 0,
    },
    fullWidth: {
      width: '100%',
    },
    halfWidth: {
      width: '50%',
    },
  },

  countryCodeWrapper: {
    position: 'relative',
  },

  countryCode: {
    position: 'absolute',
    paddingVertical: METRICS.spaceNormal,
    paddingHorizontal: METRICS.spaceMedium,
    top: 0,
    zIndex: 1,
  },
};
