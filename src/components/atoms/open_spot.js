import React from 'react';
import {View} from 'react-native';
import {styles} from '@styles';
import {COLORS} from '@theme/colors';
import CustomText from '@components/custom/custom_text';

const OpenSpot = props => {
  var colours = [
    '#1abc9c',
    '#2ecc71',
    '#3498db',
    '#9b59b6',
    '#34495e',
    '#16a085',
    '#27ae60',
    '#2980b9',
    '#8e44ad',
    '#2c3e50',
    '#f1c40f',
    '#e67e22',
    '#e74c3c',
    '#95a5a6',
    '#f39c12',
    '#d35400',
    '#c0392b',
    '#bdc3c7',
    '#7f8c8d',
  ];

  let styleArr = [
    {
      backgroundColor: props.backgroundColor
        ? props.backgroundColor
        : colours[1],

      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: COLORS.lightBlack,
    },
    styles.avatar[props.size],
  ];

  if (props.style) {
    if (Array.isArray(props.style)) {
      styleArr = [...styleArr, ...props.style];
    } else {
      styleArr = [...styleArr, props.style];
    }
  }

  return (
    <View style={styleArr}>
      <CustomText
        style={[
          styles.fontSize.small,
          styles.fontColor.white,
          styles.fontWeight.fw700,
        ]}>
        OS
      </CustomText>
    </View>
  );
};

export default OpenSpot;
