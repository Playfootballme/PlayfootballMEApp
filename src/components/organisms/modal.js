import React from 'react';
import {View} from 'react-native';
import Modal from 'react-native-modal';

import {styles} from '@styles';
import NestedModal1 from './nested_modal_1';

const ModalWrapper = props => {
  let styleArr = [styles.modalHeight];

  if (props.modalStyle === 'full') {
    styleArr = [styles.full];
  }

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
    right: 0,
    left: 0,
  };
  if (['halfWithEdge', 'fullWithEdge', 'full'].includes(props.modalStyle)) {
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

  if (['full'].includes(props.modalStyle)) {
    modalBody = (
      <View style={styleArr}>
        <View style={styles.modalBodyFull}>{props.children}</View>
      </View>
    );
  }
  return (
    <View style={styles.modalContainer}>
      <Modal
        animationType="slide"
        transparent={true}
        animationInTiming={300}
        animationOutTiming={300}
        isVisible={props.isActive}
        style={modalStyle}
        backdropColor={'#7D7D7D'}
        backdropOpacity={0.4}
        onBackdropPress={() => props.setModalVisible()}
        backdropTransitionInTiming={300}
        propagateSwipe={
          !['fullWithEdge', 'halfWithEdge'].includes(props.modalStyle)
        }
        backdropTransitionOutTiming={500}>
        {props.nestedModal_1_Visible ? (
          <NestedModal1
            isActive={props.nestedModal_1_Visible}
            isVisible={props.nestedModal_1_Visible}
            setModalVisible={props.setNestedModal_1_Visible}
            modalStyle={props.nestedModal_1_Style}
            isNestedModal2Visible={props.nestedModal_2_Visible}
            setNestedModal2Visible={props.setNestedModal_2_Visible}
            nestedModal2Style={props.nestedModal_2_Style}
            nestedModal2Body={props.nestedModal_2_Body}>
            {props.nestedModal_1_Body}
          </NestedModal1>
        ) : (
          <View />
        )}
        {modalBody}
      </Modal>
    </View>
  );
};

export default ModalWrapper;
