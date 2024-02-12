import React, {useCallback, useState} from 'react';
import {
  ScrollView,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
  View,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {styles} from '@styles';
import {COLORS} from '@theme/colors';
import HeroHeader from '@components/layout/header/hero.js';
import ModalWrapper from '@components/organisms/modal';
import CustomText from '@components/custom/custom_text';

function TabsContainer(props) {
  const onRefresh = useCallback(() => {
    if (props.refreshHandler) {
      props.refreshHandler();
    }
  }, []);

  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);

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

      <View style={[styles.rowContainer]}>
        {props.renderScene.map((scene, i) => {
          return (
            <TouchableOpacity
              key={i}
              style={[styles.tabItem, index === i && styles.tabActive]}
              onPress={() => setIndex(i)}>
              {scene.type === 'text' ? (
                <CustomText style={styles.tabText}>{scene.title}</CustomText>
              ) : (
                scene.title
              )}
            </TouchableOpacity>
          );
        })}
      </View>

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
        {props.renderScene.map((scene, i) => {
          return (
            <View
              key={i}
              style={[
                styles.container,
                {display: index === i ? 'flex' : 'none'},
              ]}>
              {scene.body}
            </View>
          );
        })}
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

export default TabsContainer;
