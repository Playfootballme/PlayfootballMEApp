import React from 'react';
import {View, TouchableOpacity, I18nManager} from 'react-native';
import {styles} from '@styles';
import CustomText from '@components/custom/custom_text';
import {METRICS} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import Icon from '@components/atoms/icon';

function Accordion(props) {
  return (
    <View style={[styles.modalRowColumn]}>
      <TouchableOpacity
        style={[
          styles.rowContainer,
          styles.justifyBetween,
          {
            marginBottom: METRICS.spaceSmall,
          },
        ]}
        onPress={() => props.expandAccordion(props.index)}>
        <CustomText style={[styles.fontSize.normal, styles.fontWeight.ft600]}>
          {props.title}
        </CustomText>
        <Icon
          name={props.expanded ? 'angle-small-up' : 'angle-small-down'}
          size={20}
          color={COLORS.white}
        />
      </TouchableOpacity>

      {props.expanded && (
        <CustomText style={[styles.fontSize.small]}>{props.body}</CustomText>
      )}
    </View>
  );
}

export default Accordion;
