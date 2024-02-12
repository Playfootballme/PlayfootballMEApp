import React from 'react';
import {View} from 'react-native';
import {METRICS} from '@theme/metrics';

function List(props) {
  let styleArr = [];

  if (props.style) {
    if (Array.isArray(props.style)) {
      styleArr = [...styleArr, ...props.style];
    } else {
      styleArr = [...styleArr, props.style];
    }
  }

  if (props.loading && props.loading === true) {
    return <props.renderLoadingItem />;
  }

  if (props.data?.length === 0) {
    return <props.renderEmptyItem />;
  }
  return (
    <View style={styleArr}>
      {props.data?.length > 0 &&
        props.data?.map((item, index) => {
          return (
            <View key={index}>
              <props.renderItem item={item} />
            </View>
          );
        })}
    </View>
  );
}

export default List;
