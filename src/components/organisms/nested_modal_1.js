import React from 'react';
import {ScrollView, View} from 'react-native';
import Modal from 'react-native-modal';

import {COLORS} from '@theme/colors';
import {styles} from '@styles';
import NestedModal2 from './nested_modal_2';

const NestedModal1 = props => {
  let styleArr = [styles.modalHeight];

  if (props.modalStyle === 'fullWithEdge') {
    styleArr = [styles.fullWithEdge];
  }

  if (props.modalStyle === 'halfWithEdge') {
    styleArr = [styles.halfWithEdge];
  }

  let modalStyle = {
    position: 'absolute',
    top: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  };
  if (['halfWithEdge', 'fullWithEdge'].includes(props.modalStyle)) {
    modalStyle = {
      justifyContent: 'flex-end',
      margin: 0,
    };
  }

  let modalBody = (
    <View style={styleArr}>
      <View style={styles.modalBody}>{props.children}</View>
    </View>
  );

  if (['halfWithEdge', 'fullWithEdge'].includes(props.modalStyle)) {
    modalBody = (
      <View style={styleArr}>
        <View style={styles.modalEdge} />
        <View style={styles.modalBodyFullWithEdge}>{props.children}</View>
      </View>
    );
  }
  return (
    <View style={styles.modalContainer}>
      <Modal
        animationType="slide"
        transparent={true}
        isVisible={props.isActive}
        style={modalStyle}
        backdropColor={'#7D7D7D'}
        backdropOpacity={0.4}
        onBackdropPress={() => props.setModalVisible()}
        backdropTransitionInTiming={100}
        propagateSwipe={
          !['fullWithEdge', 'halfWithEdge'].includes(props.modalStyle)
        }
        backdropTransitionOutTiming={500}>
        {props.isNestedModal2Visible ? (
          <NestedModal2
            isActive={props.isNestedModal2Visible}
            setModalVisible={props.setNestedModal2Visible}
            modalStyle={props.nestedModal2Style}>
            {props.nestedModal2Body}
          </NestedModal2>
        ) : (
          <View />
        )}
        {modalBody}
      </Modal>
    </View>
  );
};

export default NestedModal1;
