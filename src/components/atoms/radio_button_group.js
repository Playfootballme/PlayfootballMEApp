import React from 'react';
import {View, TouchableOpacity, Image, I18nManager} from 'react-native';

import CustomText from '@components/custom/custom_text';
import {styles} from '@styles';
import Icon from '@components/atoms/icon';
import {COLORS} from '@theme/colors';
import CustomImage from '@components/custom/custom_image';
import {METRICS} from '../../theme/metrics';

function RadioButtonGroup({options, onChange, isRemoteImage}) {
  return (
    <View
      style={{
        width: '100%',
      }}>
      {options?.map((option, index) => (
        <TouchableOpacity
          style={
            options.length - 1 === index
              ? [{marginBottom: METRICS.spaceXXLarge}, styles.modalRow]
              : styles.modalRow
          }
          key={index}
          onPress={() => onChange(option.value)}>
          <View
            style={[
              styles.rowContainer,
              styles.alignCenter,
              styles.justifyBetween,
            ]}>
            {option.img && (
              <CustomImage
                style={[styles.optionFlag]}
                source={isRemoteImage ? {uri: option.img} : option.img}
                resizeMode="contain"
              />
            )}

            <View
              style={{
                flex: 1,
                alignItems: 'flex-start',
              }}>
              <CustomText style={[styles.fontSize.normal]}>
                {option?.label ? option.label : 'Enter label'}
              </CustomText>
            </View>

            {option?.isSelected && (
              <View
                style={[
                  styles.iconCircle,
                  {backgroundColor: COLORS.blue, width: 20, height: 20},
                ]}>
                <Icon name="checkmark" size={12} color={COLORS.white} />
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default RadioButtonGroup;
