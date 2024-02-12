/**
 * @format
 */
import React from 'react';
import {AppRegistry, I18nManager} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import store from '@stores';
import './src/localization/i18n';
import {getData} from './src/config/functions';
import {enConfig, arConfig} from '@config/moment_locale';
import 'moment';
import 'moment/locale/ar';
import 'moment/locale/en-gb';
import moment from 'moment';
const getCurrentLanguage = async () => {
  const languageFromAsync = await getData('currentLang');

  if (languageFromAsync) {
    return languageFromAsync;
  } else {
    return 'en';
  }
};

getCurrentLanguage().then(this_lang => {
  moment().locale(this_lang === 'en' ? 'en-gb' : 'ar');
  moment.updateLocale(
    this_lang === 'en' ? 'en-gb' : 'ar',
    this_lang === 'en' ? enConfig : arConfig,
  );
  I18nManager.allowRTL(this_lang === 'ar');
  I18nManager.forceRTL(this_lang === 'ar');
  I18nManager.swapLeftAndRightInRTL(this_lang === 'ar');
});
const RNRedux = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => RNRedux);
