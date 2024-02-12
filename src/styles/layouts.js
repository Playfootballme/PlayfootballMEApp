import {METRICS} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;

export const layouts = {
  container: {
    marginHorizontal: METRICS.spaceMedium,
  },
  heroContainer: {
    paddingTop: METRICS.spaceMedium,
    paddingBottom: METRICS.spaceTiny,
    paddingHorizontal: METRICS.spaceMedium,
    marginBottom: METRICS.spaceMedium,
    overflow: 'hidden',
  },

  homeContainer: {
    overflow: 'hidden',
    height: 155,
    backgroundColor: COLORS.black,
    paddingTop: METRICS.spaceMedium,
    paddingBottom: METRICS.spaceTiny,
    paddingHorizontal: METRICS.spaceMedium,
  },
  matchThumbnailWrapper: {
    width: '100%',
    height: 160,
    borderRadius: METRICS.borderRadiusMedium,
    overflow: 'hidden',
    justifyContent: 'space-between',
    marginBottom: METRICS.spaceNormal,

    small: {
      width: 150,
      height: 150,
      marginBottom: METRICS.spaceTiny,
    },
  },
  matchThumbnail160: {
    width: 160,
  },
  matchThumbnail100: {
    width: 100,
  },

  matchThumbnailWrapper80: {
    width: '100%',
    height: 50,
    borderRadius: METRICS.borderRadiusMedium,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  matchThumbnail80: {
    width: 50,
  },
  matchThumbnail: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: METRICS.borderRadiusMedium,
    width: '100%',
    height: '100%',
  },

  matchThumbnailSmall: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: METRICS.borderRadiusMedium,
    width: 160,
    height: 80,
  },

  overlay: {
    backgroundColor: COLORS.lighterGrey,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  overlayDark: {
    backgroundColor: COLORS.lightBlack,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  tag: {
    backgroundColor: COLORS.lightBlack,
    padding: METRICS.spaceTiny,
    zIndex: 4,

    text: {
      color: COLORS.white,
      fontSize: METRICS.sizeSmall,
      fontWeight: '600',
    },

    loc: {
      right: {
        borderTopLeftRadius: METRICS.borderRadiusTiny,
        borderBottomLeftRadius: METRICS.borderRadiusTiny,
        overflow: 'hidden',
      },
      left: {
        borderTopRightRadius: METRICS.borderRadiusTiny,
        borderBottomRightRadius: METRICS.borderRadiusTiny,
        overflow: 'hidden',
      },
    },
  },
  tagOutline: {
    padding: METRICS.spaceTiny,
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: METRICS.borderRadiusTiny,
  },
  card: {
    backgroundColor: COLORS.evenLighterGrey,
    borderRadius: METRICS.borderRadiusMedium,
    padding: METRICS.spaceNormal,
    overflow: 'hidden',
  },

  fieldHeroImage: {
    borderRadius: METRICS.borderRadiusMedium,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },

  photoAlbum: {
    width: 100,
    height: 100,
    borderRadius: METRICS.borderRadiusMedium,
    overflow: 'hidden',
  },

  photoAlbumFull: {
    width: windowWidth,
    height: 400,
    borderRadius: METRICS.borderRadiusMedium,
    overflow: 'hidden',
  },
};
