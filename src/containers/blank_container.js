import React from 'react';
import {
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  I18nManager,
  View,
} from 'react-native';
import {styles} from '@styles';
import {COLORS} from '@theme/colors';
import Header from '@components/layout/header';
import Icon from '@components/atoms/icon';
import {METRICS} from '../theme/metrics';
import ModalWrapper from '@components/organisms/modal';

function BlankContainer(props) {
  return (
    <SafeAreaView
      style={[styles.flex, styles.justifyBetween, styles.darkBackground]}>
      <StatusBar
        animated={false}
        backgroundColor={COLORS.black}
        barStyle="light-content"
      />
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        {props.children}
      </ScrollView>

      <ModalWrapper
        isActive={props.modalIsActive}
        setModalVisible={props.setModalIsActive}
        modalStyle={props.modalStyle}>
        {props.modalBody && props.modalBody}
      </ModalWrapper>
    </SafeAreaView>
  );
}

export default BlankContainer;
