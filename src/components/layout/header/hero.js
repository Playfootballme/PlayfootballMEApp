import * as React from 'react';
import {View, I18nManager, TouchableOpacity} from 'react-native';

import {styles} from '@styles';
import CustomText from '@components/custom/custom_text';
import {COLORS} from '@theme/colors';
import Icon from '@components/atoms/icon';
import CustomImage from '@components/custom/custom_image';

function HeroHeader(props) {
  return (
    <View style={[styles.heroContainer]}>
      <View
        style={[
          // styles.flex,
          styles.rowContainer,
          styles.justifyBetween,
          styles.alignCenter,
        ]}>
        {props.onPressBack && (
          <TouchableOpacity onPress={props.onPressBack}>
            <Icon
              name={`angle-small-${I18nManager.isRTL ? 'right' : 'left'}`}
              size={25}
              color={COLORS.white}
            />
          </TouchableOpacity>
        )}
        {props.title && (
          <CustomText style={[styles.fontSize.medium, styles.fontWeight.fw600]}>
            {props.title}
            {props.subTitle && (
              <CustomText
                style={[
                  styles.fontWeight.fw400,
                  styles.fontColor.grey,
                  styles.fontSize.small,
                ]}>
                {props.subTitle}
              </CustomText>
            )}
          </CustomText>
        )}

        {props.headerRight ? (
          props.headerRight
        ) : (
          <CustomImage
            style={[styles.smallLogo]}
            source={require('@assets/images/logo-white.png')}
            resizeMode="contain"
          />
        )}
      </View>
    </View>
  );
}

export default HeroHeader;
