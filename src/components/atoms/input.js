import React, {useState} from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import {METRICS} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import Icon from '@components/atoms/icon';
import {useStateIfMounted} from 'use-state-if-mounted';

function Input(props) {
  const [text, setText] = useState(props.text || '');
  const [secureTextEntry, setSecureTextEntry] = useStateIfMounted(true);

  const onChangeHandler = text => {
    setText(text);
    props.onChange(text);
  };

  switch (props.variant) {
    case 'email':
      return (
        <TextInput
          value={text}
          onChangeText={onChangeHandler}
          style={[
            styles.input,
            props.hasCountryCode
              ? {[`padding${I18nManager.isRTL ? 'Right' : 'Left'}`]: 50}
              : {},
          ]}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          placeholder={props.placeholder}
          placeholderTextColor={COLORS.grey}
        />
      );
    case 'password':
      return (
        <View style={[styles.rowContainer, styles.alignCenter]}>
          <TextInput
            value={text}
            onChangeText={onChangeHandler}
            style={[
              styles.input,
              props.hasCountryCode
                ? {[`padding${I18nManager.isRTL ? 'Right' : 'Left'}`]: 50}
                : {},
            ]}
            placeholder={props.placeholder}
            placeholderTextColor={COLORS.grey}
            secureTextEntry={secureTextEntry}
          />
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setSecureTextEntry(!secureTextEntry)}>
            <Icon
              name={secureTextEntry ? 'eye' : 'eye-crossed'}
              size={METRICS.sizeMedium}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
      );
    default:
      return (
        <TextInput
          value={text}
          onChangeText={onChangeHandler}
          style={[
            styles.input,
            props.hasCountryCode
              ? {[`padding${I18nManager.isRTL ? 'Right' : 'Left'}`]: 55}
              : {},
          ]}
          inputMode={props.inputMode}
          placeholder={props.placeholder}
          placeholderTextColor={COLORS.grey}
        />
      );
  }
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
  },
  alignCenter: {
    alignItems: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    paddingVertical: METRICS.spaceNormal,
    paddingHorizontal: METRICS.spaceMedium,
    borderRadius: METRICS.borderRadiusMedium,
    backgroundColor: COLORS.lightGrey,
    borderColor: COLORS.lightGrey,
    color: COLORS.white,
    fontSize: METRICS.fontSizeNormal,
  },
  iconContainer: {
    position: 'absolute',
    [I18nManager.isRTL ? 'left' : 'right']: METRICS.spaceNormal,
    bottom: METRICS.spaceNormal,
  },
});

export default Input;
