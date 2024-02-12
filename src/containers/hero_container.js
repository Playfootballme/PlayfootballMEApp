import React, {useCallback} from 'react';
import {
  ScrollView,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import {styles} from '@styles';
import {COLORS} from '@theme/colors';
import HeroHeader from '@components/layout/header/hero.js';
import ModalWrapper from '@components/organisms/modal';

function HeroContainer(props) {
  const onRefresh = useCallback(() => {
    if (props.refreshHandler) {
      props.refreshHandler();
    }
  }, []);

  return (
    <SafeAreaView style={[styles.flex, styles.darkBackground]}>
      <StatusBar
        animated={false}
        backgroundColor={COLORS.black}
        barStyle="light-content"
      />
      <HeroHeader
        title={props.title}
        onPressBack={props.onPressBack}
        headerRight={props.headerRight}
      />
      <ScrollView
        refreshControl={
          props.refreshHandler && (
            <RefreshControl
              refreshing={props.refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.white]}
              tintColor={COLORS.white}
            />
          )
        }>
        {props.children}
      </ScrollView>
      {props.bottomButton && props.bottomButton}

      <ModalWrapper
        isActive={props.modalIsActive}
        setModalVisible={props.setModalIsActive}
        modalStyle={props.modalStyle}
        nestedModal_1_Style={props.nestedModalStyle}
        nestedModal_1_Visible={props.nestedModalIsActive}
        setNestedModal_1_Visible={props.setNestedModalIsActive}
        nestedModal_1_Body={props.nestedModalBody}>
        {props.modalBody && props.modalBody}
      </ModalWrapper>
    </SafeAreaView>
  );
}

export default HeroContainer;
