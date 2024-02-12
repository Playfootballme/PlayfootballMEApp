import {COLORS} from '@theme/colors';
import {METRICS} from '@theme/metrics';

// sizeSmall
// sizeNormal
// sizeCompact
// sizeLarge
// sizeXLarge
export const avatar = {
  avatar: {
    tiny: {
      width: 25,
      height: 25,
      borderRadius: 100,
    },
    small: {
      width: 30,
      height: 30,
      borderRadius: 100,
    },

    large: {
      width: 85,
      height: 85,
      borderRadius: 100,
    },

    normal: {
      width: 50,
      height: 50,
      borderRadius: 100,
    },

    Xlarge: {
      width: 110,
      height: 110,
      borderRadius: 110,
    },

    fontSize: {
      tiny: {
        fontSize: METRICS.sizeTiny,
      },
      small: {
        fontSize: METRICS.sizeSmall,
      },
      large: {
        fontSize: METRICS.sizeLarge,
      },
      normal: {
        fontSize: METRICS.sizeNormal,
      },
      Xlarge: {
        fontSize: METRICS.sizeXLarge,
      },
    },
  },

  captainTag: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 15,
    height: 15,
    borderRadius: 100,
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
  },

  GKTag: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 15,
    height: 15,
    borderRadius: 100,
    backgroundColor: COLORS.backgroundYellow,
    justifyContent: 'center',
    alignItems: 'center',
  },

  optionFlag: {
    resizeMode: 'contain',
    height: 30,
    width: 40,
    marginRight: METRICS.spaceTiny,
  },
};
