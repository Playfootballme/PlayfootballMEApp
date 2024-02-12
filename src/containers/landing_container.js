import React from 'react';
import {ScrollView, SafeAreaView, StatusBar, View} from 'react-native';
import {styles} from '@styles';
import {COLORS} from '@theme/colors';
import Header from '@components/layout/header';

function LandingContainer(props) {
  return (
    <SafeAreaView
      style={[styles.flex, styles.justifyBetween, styles.darkBackground]}>
      <StatusBar
        animated={false}
        backgroundColor={COLORS.black}
        barStyle="light-content"
      />
      <Header />
      {props.scroll ? (
        <ScrollView>{props.children}</ScrollView>
      ) : (
        <View style={styles.flex}>{props.children}</View>
      )}
    </SafeAreaView>
  );
}

export default LandingContainer;
