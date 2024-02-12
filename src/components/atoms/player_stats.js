import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import {styles} from '@styles';
import Icon from './icon';
import CustomText from '../custom/custom_text';
import {COLORS} from '../../theme/colors';
import {METRICS} from '../../theme/metrics';
import {t} from 'i18next';

const PlayerStats = props => {
  const {redCards, yellowCards, assists, goals, motm, loading} = props;

  const CardIcon = ({color}) => {
    return <View style={[styles.refCard, styles.refCardColor[color]]} />;
  };
  return (
    <View
      style={[
        styles.rowContainer,
        styles.alignCenter,
        styles.justifyBetween,
        {marginTop: METRICS.spaceTiny},
      ]}>
      <View style={[styles.alignCenter, styles.statsItem]}>
        <CardIcon color="red" />
        <View style={{marginVertical: METRICS.spaceTiny}}>
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <CustomText style={styles.fontSize.medium}>{redCards}</CustomText>
          )}
        </View>
        <CustomText style={styles.fontSize.small}>
          {t('profile:redCardsLabel')}
        </CustomText>
      </View>
      <View style={[styles.alignCenter, styles.statsItem]}>
        <CardIcon color="yellow" />
        <View style={{marginVertical: METRICS.spaceTiny}}>
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <CustomText style={styles.fontSize.medium}>
              {yellowCards}
            </CustomText>
          )}
        </View>
        <CustomText style={styles.fontSize.small}>
          {t('profile:yellowCardsLabel')}
        </CustomText>
      </View>
      <View style={[styles.alignCenter, styles.statsItem]}>
        <Icon name="football" size={22} color={COLORS.white} />
        <View style={{marginVertical: METRICS.spaceTiny}}>
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <CustomText style={styles.fontSize.medium}>{goals}</CustomText>
          )}
        </View>
        <CustomText style={styles.fontSize.small}>
          {t('profile:goalsLabel')}
        </CustomText>
      </View>
      <View style={[styles.alignCenter, styles.statsItem]}>
        <Icon name="handshake" size={22} color={COLORS.white} />
        <View style={{marginVertical: METRICS.spaceTiny}}>
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <CustomText style={styles.fontSize.medium}>{assists}</CustomText>
          )}
        </View>
        <CustomText style={styles.fontSize.small}>
          {t('profile:assistsLabel')}
        </CustomText>
      </View>
      <View style={[styles.alignCenter, styles.statsItem]}>
        <Icon name="medal" size={22} color={COLORS.white} />
        <View style={{marginVertical: METRICS.spaceTiny}}>
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <CustomText style={styles.fontSize.medium}>{motm}</CustomText>
          )}
        </View>
        <CustomText style={styles.fontSize.small}>
          {t('profile:motmLabel')}
        </CustomText>
      </View>
    </View>
  );
};

export default PlayerStats;
