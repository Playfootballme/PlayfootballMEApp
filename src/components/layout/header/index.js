import * as React from 'react';
import {Image, View} from 'react-native';

import {styles} from '@styles';
import CustomImage from '@components/custom/custom_image';

function Header(props) {
  return (
    <View style={[styles.heroContainer]}>
      <View
        style={[styles.rowContainer, styles.justifyCenter, styles.alignCenter]}>
        <CustomImage
          style={{
            width: 150,
            height: 70,
          }}
          source={require('@assets/images/logo-white-full.png')}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

export default Header;
