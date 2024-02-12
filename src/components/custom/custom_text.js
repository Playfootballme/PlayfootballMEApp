import React from 'react';
import {I18nManager, Text} from 'react-native';
import {styles} from '@styles';
import {useSelector} from 'react-redux';
import {getLanguage} from '@stores/selectors';

function CustomText(props) {
  const currentLang = useSelector(getLanguage);
  let styleArr = [styles.fontColor.white, styles[`fontFamily_${currentLang}`]];
  // if (props.mode === 'light') {
  //   styleArr = [...props.style, styles.fontColor.black];
  // }

  if (props.style) {
    if (Array.isArray(props.style)) {
      styleArr = [...styleArr, ...props.style];
    } else {
      styleArr = [...styleArr, props.style];
    }
  }

  if (I18nManager.isRTL) {
    styleArr = [...styleArr, {writingDirection: 'rtl'}];
  }
  const prettifyCamelCase = () => {
    var output = '';
    var len = props.children.length;
    var char;

    for (var i = 0; i < len; i++) {
      char = props.children.charAt(i);

      if (i == 0) {
        output += char.toUpperCase();
      } else if (char !== char.toLowerCase() && char === char.toUpperCase()) {
        output += ' ' + char;
      } else if (char == '-' || char == '_') {
        output += ' ';
      } else {
        output += char;
      }
    }

    return output;
  };

  return (
    <Text style={styleArr} allowFontScaling={false}>
      {props.prettify ? prettifyCamelCase() : props.children}
    </Text>
  );
}

export default CustomText;
