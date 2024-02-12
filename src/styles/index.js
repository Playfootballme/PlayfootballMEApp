import {StyleSheet} from 'react-native';
import {flex} from './flex';
import {layouts} from './layouts';
import {modal} from './modal';
import {forms} from './forms';
import {avatar} from './avatar';
import {typography} from './typography';
import {tabs} from './tabs';
import {icons} from './icons';
import {COLORS} from '@theme/colors';
import {METRICS} from '@theme/metrics';

export const styles = StyleSheet.create({
  ...flex,
  ...layouts,
  ...modal,
  ...forms,
  ...typography,
  ...avatar,
  ...icons,
  ...tabs,
  lightBackground: {
    backgroundColor: COLORS.white,
  },

  darkBackground: {
    backgroundColor: COLORS.black,
  },

  hr: {
    marginVertical: METRICS.spaceSmall,
    height: 1,
    backgroundColor: COLORS.white,
    opacity: 0.25,
  },

  hrDashed: {
    marginVertical: METRICS.spaceSmall,
    borderColor: COLORS.lightGrey,
    height: 2,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 1,
  },
  smallLogo: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },

  mediumLogo: {
    width: 150,
    height: 70,
    resizeMode: 'contain',
  },
});
