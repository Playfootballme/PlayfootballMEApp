import React from 'react';
import {View, ActivityIndicator} from 'react-native';

import {styles} from '@styles';
import {COLORS} from '@theme/colors';
import CustomText from '@components/custom/custom_text';
import CustomImage from '@components/custom/custom_image';

const Avatar = props => {
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

  var name = props.name !== undefined ? props.name : 'Deleted User',
    nameSplit = name.split(' '),
    initials =
      nameSplit[0].charAt(0).toUpperCase() +
      nameSplit[1].charAt(0).toUpperCase();
  var charIndex = initials.charCodeAt(0) - 65,
    colourIndex = charIndex % 19;

  let styleArr = [
    {
      backgroundColor: props.backgroundColor
        ? props.backgroundColor
        : colours[colourIndex],

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

  if (!props.img) {
    return (
      <View style={styleArr}>
        {props.loading ? (
          <ActivityIndicator size="Large" color="#fff" />
        ) : (
          <CustomText
            style={[
              styles.fontColor.white,
              styles.fontWeight.fw700,
              styles.avatar.fontSize[props.size],
            ]}>
            {initials}
          </CustomText>
        )}
        {props.isCaptain && (
          <View style={styles.captainTag}>
            <CustomText style={[styles.fontSize.tiny, styles.fontColor.white]}>
              C
            </CustomText>
          </View>
        )}

        {props.isGK && (
          <View style={styles.GKTag}>
            <CustomText style={[styles.fontSize.tiny, styles.fontColor.black]}>
              GK
            </CustomText>
          </View>
        )}
        {props.isViceCaptain && (
          <View style={styles.captainTag}>
            <CustomText style={[styles.fontSize.tiny, styles.fontColor.white]}>
              V
            </CustomText>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styleArr}>
      {props.loading ? (
        <ActivityIndicator size="Large" color="#fff" />
      ) : (
        <CustomImage
          source={props.isLocalImg ? props.img : {uri: props.img}}
          style={[styles.avatar[props.size]]}
          resizeMode={props.resizeMode}
        />
      )}
      {props.isCaptain && (
        <View style={styles.captainTag}>
          <CustomText style={[styles.fontSize.tiny, styles.fontColor.white]}>
            C
          </CustomText>
        </View>
      )}
      {props.isGK && (
        <View style={styles.GKTag}>
          <CustomText style={[styles.fontSize.tiny, styles.fontColor.black]}>
            GK
          </CustomText>
        </View>
      )}
      {props.isViceCaptain && (
        <View style={styles.captainTag}>
          <CustomText style={[styles.fontSize.tiny, styles.fontColor.white]}>
            V
          </CustomText>
        </View>
      )}
    </View>
  );
};

export default Avatar;
