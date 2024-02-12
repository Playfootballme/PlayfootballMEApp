import React from 'react';
import {useNavigation, CommonActions} from '@react-navigation/native';

import BlankContainer from '@containers/blank_container';

import {styles} from '@styles';
import {View} from 'react-native';
import CustomText from '@components/custom/custom_text';
import {METRICS} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import Button from '@components/atoms/button';
import Icon from '@components/atoms/icon';

function SuccessAndLoginScreen(props) {
  const navigation = useNavigation();
  const {msg} = props.route.params;

  const signInToApp = () => {
    navigation.replace('TabsStack', {
      screen: 'HomeScreen',
    });
  };

  return (
    <BlankContainer>
      <View style={[styles.flex, styles.container]}>
        <View style={[styles.flex, styles.alignCenter, styles.justifyCenter]}>
          <View
            style={[
              styles.modalConfirmIcon,
              {marginBottom: METRICS.spaceSmall},
            ]}>
            <Icon name={'checkmark'} size={100} color={COLORS.white} />
          </View>
          <CustomText
            style={[
              styles.fontSize.compact,
              styles.fontWeight.fw600,
              {textAlign: 'center', marginBottom: METRICS.spaceCompact},
            ]}>
            {msg}
          </CustomText>

          <Button
            content={'Sign In'}
            onPress={() => signInToApp()}
            variant="solid"
            size="normal"
            fullWidth
          />
        </View>
      </View>
    </BlankContainer>
  );
}

export default SuccessAndLoginScreen;
