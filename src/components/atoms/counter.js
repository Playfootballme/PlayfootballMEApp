import React from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import {styles} from '@styles';
import CustomText from '@components/custom/custom_text';

import Button from '@components/atoms/button';
import {METRICS} from '@theme/metrics';

function Counter(props) {
  return (
    <View style={[styles.rowContainer, styles.alignCenter]}>
      <Button
        variant={'solid'}
        size={'tiny'}
        content={'+'}
        onPress={props.onIncrement}
      />

      <TouchableOpacity style={styles.button} onPress={props.onIncrement}>
        <Text
          style={[
            styles.button.style.solid.text,
            styles.button.size.normal.text,
          ]}>
          {props.content}
        </Text>
      </TouchableOpacity>

      <CustomText style={{marginHorizontal: METRICS.spaceSmall}}>
        {props.value}
      </CustomText>

      <TouchableOpacity onPress={props.onDecrement}>
        <CustomText>-</CustomText>
      </TouchableOpacity>
    </View>
  );
}

export default Counter;
