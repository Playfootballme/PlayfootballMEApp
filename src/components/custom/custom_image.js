import React from 'react';
import {Image, Platform, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {styles} from '@styles';

function CustomImage(props) {
  let styleArr = [];
  if (props.style) {
    if (Array.isArray(props.style)) {
      styleArr = [...styleArr, ...props.style];
    } else {
      styleArr = [...styleArr, props.style];
    }
  }

  if (Platform.OS === 'android') {
    if (props.isBackground === true) {
      return (
        <View
          style={
            props.isFullWidth
              ? [styles.matchThumbnailWrapper80]
              : [styles.matchThumbnailWrapper]
          }>
          <Image
            style={styles.matchThumbnail}
            source={props.source}
            resizeMode={props.resizeMode}
          />
          <View style={styles.overlay} />
          {props.children}
        </View>
      );
    } else {
      return (
        <Image
          style={styleArr}
          source={props.source}
          resizeMode={props.resizeMode}
        />
      );
    }
  } else {
    if (props.isBackground === true) {
      return (
        <View
          style={
            props.isFullWidth
              ? [styles.matchThumbnailWrapper80]
              : [styles.matchThumbnailWrapper]
          }>
          <FastImage
            style={styles.matchThumbnail}
            source={props.source}
            resizeMode={props.resizeMode}
          />
          <View style={styles.overlay} />
          {props.children}
        </View>
      );
    } else {
      return (
        <FastImage
          style={styleArr}
          source={props.source}
          resizeMode={FastImage.resizeMode[props.resizeMode]}
        />
      );
    }
  }
}

export default CustomImage;
