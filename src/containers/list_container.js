import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  FlatList,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {styles} from '@styles';
import {COLORS} from '@theme/colors';
import HeroHeader from '@components/layout/header/hero.js';
import MatchThumbnail from '@components/custom/match_thumbnail';

import CustomText from '@components/custom/custom_text';
import FieldThumbnail from '@components/custom/field_thumbnail';

function ListContainer(props) {
  const renderItem = ({item, index}) => {
    const the_item = {
      item: item,
    };

    if (props.fetching) {
      return;
    }

    if (props.dataType === 'fields') {
      return (
        <View>
          <FieldThumbnail
            onPress={() => props.fieldPickerHandler(item.id)}
            item={the_item}
            index={index}
            fullWidth={true}
          />
        </View>
      );
    }
    return (
      <View>
        <MatchThumbnail
          onPress={() => props.matchPickedHandler(item.id)}
          item={the_item}
          index={index}
          loading={item.id === props.currentID}
          fullWidth
        />
      </View>
    );
  };

  const renderEmptyItem = (
    <View style={[styles.container]}>
      <CustomText style={[styles.fontSize.normal, {textAlign: 'center'}]}>
        {props.emptyString}
      </CustomText>
    </View>
  );

  const keyExtractor = (item, index) => {
    return index;
  };

  return (
    <SafeAreaView style={[styles.flex, styles.darkBackground]}>
      <StatusBar
        animated={false}
        backgroundColor={COLORS.black}
        barStyle="light-content"
      />
      <HeroHeader
        title={props.title}
        subTitle={props.subTitle}
        onPressBack={props.onPressBack}
        headerRight={props.headerRight}
      />

      <View style={[styles.flex, styles.container]}>
        <FlatList
          style={styles.flex}
          numColumns={1}
          ItemSeparatorComponent={() => <View style={{height: 10}} />}
          data={props.fetching ? [1] : props.data}
          renderItem={renderItem}
          ListEmptyComponent={renderEmptyItem}
          keyExtractor={keyExtractor}
          initialNumToRender={10} // Render the first 10 items initially
          maxToRenderPerBatch={5} // Number of items to render in each batch
          windowSize={10} // Number of items to keep in memory above and below the viewport
          refreshControl={
            <RefreshControl
              colors={[COLORS.white]}
              size="large"
              refreshing={props.fetching}
              onRefresh={props.onRefresh}
              tintColor={COLORS.white}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
}

export default ListContainer;
