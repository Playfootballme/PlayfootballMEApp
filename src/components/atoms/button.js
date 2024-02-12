import * as React from 'react';
import {
  TouchableOpacity,
  View,
  ActivityIndicator,
  I18nManager,
} from 'react-native';
import {styles} from '@styles';
import CustomText from '@components/custom/custom_text';
import Icon from '@components/atoms/icon';
import {COLORS} from '@theme/colors';
import {METRICS} from '@theme/metrics';

function Button(props) {
  let styleArr = [styles.button];
  if (props.style) {
    if (Array.isArray(props.style)) {
      styleArr = [...styleArr, ...props.style];
    } else {
      styleArr = [...styleArr, props.style];
    }
  }
  if (props.variant) {
    styleArr.push(styles.button.style[props.variant]);
  }
  if (props.size) {
    styleArr.push(styles.button.size[props.size]);
  }
  if (props.fullWidth) {
    styleArr.push(styles.button.fullWidth);
    if (props.variant === 'link') {
      styleArr.push(styles.justifyBetween);
      styleArr.push(styles.alignCenter);
    }
  }

  if (props.halfWidth) {
    styleArr.push(styles.button.halfWidth);
  }

  if (props.noPadding) {
    styleArr.push(styles.button.noPadding);
  }

  if (props.disabled) {
    styleArr.push(styles.button.disabled);
  }

  return (
    <TouchableOpacity
      style={styleArr}
      onPress={props.onPress}
      disabled={props.disabled}>
      <View style={[styles.rowContainer, styles.alignCenter]}>
        {props.iconLeft && <View style={{width: 20}}>{props.iconLeft}</View>}
        {props.loading ? (
          <ActivityIndicator
            size="small"
            color={styles.button.style[props.variant].text}
          />
        ) : (
          <CustomText
            style={[
              styles.button.style[props.variant].text,
              styles.button.size[props.size].text,
              {marginLeft: props.iconLeft ? METRICS.spaceTiny : 0},
            ]}>
            {props.content}
          </CustomText>
        )}
      </View>
      {props.variant === 'link' && (
        <Icon
          name={`angle-small-${I18nManager.isRTL ? 'left' : 'right'}`}
          size={20}
          color={COLORS.white}
        />
      )}
    </TouchableOpacity>
  );
}

export default Button;
