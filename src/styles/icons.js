import {COLORS} from '@theme/colors';
import {METRICS} from '@theme/metrics';

export const icons = {
  iconBackground: {
    backgroundColor: COLORS.lightGrey,
    borderRadius: METRICS.borderRadiusMedium,
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconCircle: {
    width: 35,
    height: 35,
    borderRadius: 35,
    backgroundColor: COLORS.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    small: {
      width: 30,
      height: 30,
    },
  },
  iconBackgroundWhatsapp: {
    backgroundColor: '#25D366',
  },
  iconBackgroundFacebook: {
    backgroundColor: '#4267B2',
  },
  iconBackgroundCall: {
    backgroundColor: '#5D3DB1',
  },
  iconBackgroundYoutube: {
    backgroundColor: '#FF0000',
  },
  iconBackgroundTikTok: {
    backgroundColor: COLORS.lightGrey,
  },
  iconBackgroundRemove: {
    backgroundColor: COLORS.backgroundIconRedFull,
  },

  iconBackgroundAbsent: {
    backgroundColor: COLORS.blue,
  },
  refCard: {
    width: 17,
    height: 22,
    borderRadius: 4,
  },
  refCardColor: {
    red: {
      backgroundColor: '#ff5100',
    },

    yellow: {
      backgroundColor: '#ffcc00',
    },
  },
  statsItem: {
    width: 50,
  },
};
