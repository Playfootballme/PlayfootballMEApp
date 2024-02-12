import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import CustomText from '@components/custom/custom_text';
import {styles} from '@styles';
import Icon from '@components/atoms/icon';
import {COLORS} from '@theme/colors';
import {METRICS} from '../../theme/metrics';

function Checkbox({label, value, onChange}) {
  return (
    <View>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onPress={() => onChange()}>
        <View
          style={[
            styles.rowContainer,
            styles.alignCenter,
            styles.justifyBetween,
          ]}>
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: value ? COLORS.blue : 'transparent',
                width: 20,
                height: 20,
                borderWidth: 1,
                borderColor: value ? COLORS.blue : COLORS.white,
                marginRight: METRICS.spaceTiny,
              },
            ]}>
            {value && <Icon name="checkmark" size={12} color={COLORS.white} />}
          </View>

          <CustomText style={[styles.fontSize.small]}>{label}</CustomText>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default Checkbox;
