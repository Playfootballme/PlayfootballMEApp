import React, {useState} from 'react';
import {StyleSheet, Dimensions, View, ActivityIndicator} from 'react-native';
import Pdf from 'react-native-pdf';
import {COLORS} from '@theme/colors';

function PDFReader(props) {
  const [loading, setLoading] = useState(true);
  const source = {uri: props.source, cache: false};
  //const source = require('./test.pdf');  // ios only
  //const source = {uri:'bundle-assets://test.pdf' };
  //const source = {uri:'file:///sdcard/test.pdf'};
  //const source = {uri:"data:application/pdf;base64,JVBERi0xLjcKJc..."};
  //const source = {uri:"content://com.example.blobs/xxxxxxxx-...?offset=0&size=xxx"};
  //const source = {uri:"blob:xxxxxxxx-...?offset=0&size=xxx"};

  return (
    <View style={styles.container}>
      {loading && (
        <View style={[styles.justifyCenter]}>
          <ActivityIndicator color="#fff" size="large" />
        </View>
      )}
      <Pdf
        onLoadComplete={(numberOfPages, filePath) => {
          setLoading(false);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={error => {
          console.log('onError', error);
        }}
        onPressLink={uri => {
          console.log(`Link pressed: ${uri}`);
        }}
        onLoadProgress={this_percent => {
          if (this_percent) {
            setLoading(false);
          }
        }}
        trustAllCerts={false}
        source={source}
        style={styles.pdf}
        enablePaging
        horizontal
        showsHorizontalScrollIndicator
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height,
  },
  pdf: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: COLORS.black,
  },
});

export default PDFReader;
