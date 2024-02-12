import {METRICS} from '@theme/metrics';
import {COLORS} from '@theme/colors';

export const modal = {
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeight: {
    // minHeight: 350,
    // maxHeight: 400,
    backgroundColor: COLORS.black,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    overflow: 'hidden',
  },
  full: {
    backgroundColor: COLORS.black,
    height: '100%',
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  fullWithEdge: {
    backgroundColor: COLORS.black,
    height: '80%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },

  halfWithEdge: {
    backgroundColor: COLORS.black,
    height: '50%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  modalEdge: {
    height: 5,
    width: 80,
    backgroundColor: COLORS.white,
    alignSelf: 'center',
    borderRadius: METRICS.borderRadiusTiny,
    marginTop: METRICS.spaceMedium,
  },
  modalBody: {
    // flex: 1,
    // backgroundColor: 'red',

    paddingHorizontal: METRICS.spaceMedium,
    // height: '100%',
    paddingTop: METRICS.spaceXXLarge,
    paddingBottom: METRICS.spaceXLarge,
  },

  modalBodyFull: {
    height: '100%',
  },
  modalBodyFullWithEdge: {
    // flex: 1,
    // backgroundColor: 'red',

    paddingHorizontal: METRICS.spaceMedium,
    height: '100%',
    paddingTop: METRICS.sizeLarge,
    paddingBottom: METRICS.sizeXLarge,
  },

  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: METRICS.spaceMedium,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderColor,
  },

  modalRowColumn: {
    flexDirection: 'column',
    paddingVertical: METRICS.spaceMedium,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderColor,
  },

  modalFirstRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: METRICS.spaceMedium,
  },

  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: METRICS.spaceSmall,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderColor,
  },

  invitedPlayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: METRICS.spaceSmall,
  },

  buttonFirstRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: METRICS.spaceTiny,
  },

  modalConfirmIcon: {
    width: 150,
    height: 150,
    borderRadius: 150,
    backgroundColor: COLORS.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconShare: {
    marginHorizontal: METRICS.spaceSmall,
  },
};
