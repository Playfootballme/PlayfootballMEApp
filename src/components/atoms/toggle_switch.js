import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Platform,
  I18nManager,
} from 'react-native';

import PropTypes from 'prop-types';

import {COLORS} from '@theme/colors';

export default function ToggleSwitch(props) {
  const {
    isOn,
    label,
    labelPosition,
    onColor,
    offColor,
    size,
    labelStyle,
    thumbOnStyle,
    thumbOffStyle,
    trackOnStyle,
    trackOffStyle,
    onToggle,
    icon,
    disabled,
    animationSpeed,
    useNativeDriver,
    circleColor,
    hitSlop,
  } = props;

  const [offsetX] = useState(new Animated.Value(0));
  const dimensions = ToggleSwitch.calculateDimensions(size);

  useEffect(() => {
    let toValue;
    if (!I18nManager.isRTL && isOn) {
      toValue = dimensions.width - dimensions.translateX;
    } else if (I18nManager.isRTL && isOn) {
      toValue = -dimensions.width + dimensions.translateX;
    } else {
      toValue = -1;
    }

    Animated.timing(offsetX, {
      toValue,
      duration: animationSpeed,
      useNativeDriver: useNativeDriver,
    }).start();
  }, [
    isOn,
    animationSpeed,
    useNativeDriver,
    dimensions.width,
    dimensions.translateX,
  ]);

  const createToggleSwitchStyle = () => [
    {
      justifyContent: 'center',
      width: dimensions.width,
      borderRadius:
        Platform.OS == 'windows' || Platform.OS == 'macos' ? 10 : 20,
      padding: dimensions.padding,
      backgroundColor: isOn ? onColor : offColor,
      paddingBottom:
        Platform.OS == 'windows' || Platform.OS == 'macos'
          ? dimensions.padding + 2
          : dimensions.padding,
    },
    isOn ? trackOnStyle : trackOffStyle,
  ];

  const createInsideCircleStyle = () => [
    {
      alignItems: 'center',
      justifyContent: 'center',
      margin: Platform.OS === 'web' ? 0 : 4,
      left: Platform.OS === 'web' ? 4 : 0,
      position: 'absolute',
      backgroundColor: circleColor,
      transform: [{translateX: offsetX}],
      width: dimensions.circleWidth,
      height: dimensions.circleHeight,
      borderRadius: dimensions.circleWidth / 2,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2.5,
      elevation: 1.5,
    },
    isOn ? thumbOnStyle : thumbOffStyle,
  ];

  return (
    <View style={styles.container} {...props}>
      {label && labelPosition === 'left' ? (
        <Text style={[styles.labelStyle, labelStyle]}>{label}</Text>
      ) : null}
      <TouchableOpacity
        style={createToggleSwitchStyle()}
        activeOpacity={0.8}
        hitSlop={hitSlop}
        onPress={() => (disabled ? null : onToggle(!isOn))}>
        <Animated.View style={createInsideCircleStyle()}>{icon}</Animated.View>
      </TouchableOpacity>
      {label && labelPosition === 'right' ? (
        <Text style={[styles.labelStyle, labelStyle]}>{label}</Text>
      ) : null}
    </View>
  );
}

ToggleSwitch.calculateDimensions = function (size) {
  switch (size) {
    case 'small':
      return {
        width: 40,
        padding: 10,
        circleWidth: 15,
        circleHeight: 15,
        translateX: 22,
      };
    case 'large':
      return {
        width: 70,
        padding: 20,
        circleWidth: 30,
        circleHeight: 30,
        translateX: 38,
      };
    default:
      return {
        width: 46,
        padding: 12,
        circleWidth: 18,
        circleHeight: 18,
        translateX: 26,
      };
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelStyle: {
    marginHorizontal: 10,
  },
});

ToggleSwitch.propTypes = {
  isOn: PropTypes.bool.isRequired,
  label: PropTypes.string,
  labelPosition: PropTypes.string,
  onColor: PropTypes.string,
  offColor: PropTypes.string,
  size: PropTypes.string,
  labelStyle: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.number,
  ]),
  thumbOnStyle: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.number,
  ]),
  thumbOffStyle: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.number,
  ]),
  trackOnStyle: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.number,
  ]),
  trackOffStyle: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.number,
  ]),
  onToggle: PropTypes.func,
  icon: PropTypes.object,
  disabled: PropTypes.bool,
  animationSpeed: PropTypes.number,
  useNativeDriver: PropTypes.bool,
  circleColor: PropTypes.string,
  hitSlop: PropTypes.oneOfType([
    PropTypes.shape({
      top: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number,
    }),
    PropTypes.number,
  ]),
};

ToggleSwitch.defaultProps = {
  isOn: false,
  onColor: COLORS.blue,
  offColor: '#ecf0f1',
  size: 'medium',
  labelStyle: {},
  labelPosition: 'left',
  thumbOnStyle: {},
  thumbOffStyle: {},
  trackOnStyle: {},
  trackOffStyle: {},
  icon: null,
  disabled: false,
  animationSpeed: 300,
  useNativeDriver: true,
  circleColor: 'white',
};
