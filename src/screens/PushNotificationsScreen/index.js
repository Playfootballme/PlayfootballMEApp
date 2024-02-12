import React from 'react';
import {useNavigation} from '@react-navigation/native';

import HeroContainer from '@containers/hero_container';

import {COLORS} from '@theme/colors';
import {styles} from '@styles';
import {View} from 'react-native';
import CustomText from '@components/custom/custom_text';
import ToggleSwitch from '@components/atoms/toggle_switch';

function PushNotificationsScreen(props) {
  const navigation = useNavigation();
  const onPressBack = () => {
    navigation.goBack();
  };

  return (
    <HeroContainer title={'Push Notifications'} onPressBack={onPressBack}>
      <View style={[styles.container]}>
        <View>
          <View style={styles.modalRow}>
            <CustomText style={[styles.fontSize.normal]}>Mute</CustomText>
            <ToggleSwitch
              isOn={false}
              onColor={COLORS.blue}
              offColor={COLORS.grey2}
              onToggle={isOn => console.log('changed to : ', isOn)}
            />
          </View>

          <View style={styles.modalRow}>
            <CustomText style={[styles.fontSize.normal]}>New Games</CustomText>
            <ToggleSwitch
              isOn={true}
              onColor={COLORS.blue}
              offColor={COLORS.grey2}
              onToggle={isOn => console.log('changed to : ', isOn)}
            />
          </View>

          <View style={styles.modalRow}>
            <CustomText style={[styles.fontSize.normal]}>
              New Teams Games
            </CustomText>
            <ToggleSwitch
              isOn={false}
              onColor={COLORS.blue}
              offColor={COLORS.grey2}
              onToggle={isOn => console.log('changed to : ', isOn)}
            />
          </View>

          <View style={styles.modalRow}>
            <CustomText style={[styles.fontSize.normal]}>
              Available Spots
            </CustomText>
            <ToggleSwitch
              isOn={false}
              onColor={COLORS.blue}
              offColor={COLORS.grey2}
              onToggle={isOn => console.log('changed to : ', isOn)}
            />
          </View>
        </View>
      </View>
    </HeroContainer>
  );
}

export default PushNotificationsScreen;
