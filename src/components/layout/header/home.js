import * as React from 'react';
import {View} from 'react-native';

import {styles} from '@styles';
import CustomCarousel from '@components/atoms/carousel';
import CustomText from '@components/custom/custom_text';
import CustomImage from '@components/custom/custom_image';
import {METRICS} from '../../../theme/metrics';

function HomeHeader(props) {
  return (
    <View style={[styles.homeContainer]}>
      <View
        style={[
          {marginBottom: METRICS.spaceSmall},
          styles.rowContainer,
          styles.justifyBetween,
          styles.alignCenter,
        ]}>
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
      {props.announcements?.length > 0 && (
        <View style={styles.flex}>
          <CustomCarousel data={props.announcements} />
        </View>
      )}
    </View>
  );
}

export default HomeHeader;
