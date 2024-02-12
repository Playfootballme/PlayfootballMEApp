import React from 'react';
import {View, StyleSheet, I18nManager} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {METRICS} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import CustomText from '@components/custom/custom_text';
import {useStateIfMounted} from 'use-state-if-mounted';

const VerificationCode = ({onChange, isInvalid}) => {
  const [value, setValue] = useStateIfMounted('');
  const ref = useBlurOnFulfill({
    value,
    cellCount: 6,
  });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  return (
    <CodeField
      ref={ref}
      {...props}
      value={value}
      onChangeText={value => {
        setValue(value);
        onChange(value);
      }}
      cellCount={6}
      keyboardType="number-pad"
      autoFocus={true}
      renderCell={({index, symbol, isFocused}) => {
        return (
          <CustomText
            key={index}
            style={[styles.cell]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </CustomText>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  cell: {
    height: 50,
    width: 50,
    borderWidth: 1,
    paddingVertical: METRICS.spaceNormal,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: METRICS.borderRadiusMedium,
    backgroundColor: COLORS.lightGrey,
    borderColor: COLORS.lightGrey,
    color: COLORS.white,
    fontSize: METRICS.fontSizeNormal,
    fontWeight: '600',
    overflow: 'hidden',
  },
});
export default VerificationCode;
