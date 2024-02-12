import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

import HeroContainer from '@containers/hero_container';

import {styles} from '@styles';
import {View} from 'react-native';
import RenderHtml from 'react-native-render-html';
import {METRICS} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import {apiEndpoint} from '@config/functions';
import {useStateIfMounted} from 'use-state-if-mounted';
import {t} from 'i18next';
import {useSelector} from 'react-redux';
import {getLanguage} from '@stores/selectors';

function PrivacyPolicyScreen(props) {
  const navigation = useNavigation();
  const currentLang = useSelector(getLanguage);
  const [source, setSource] = useStateIfMounted({html: ''});
  const fetchData = async () => {
    const response = await fetch(
      `${apiEndpoint}/privacy-policy?locale=${currentLang}`,
    );
    const data = await response.json();
    if (data.data) {
      setSource({
        html: `<div style='color: ${COLORS.white}; text-align: left'>${data.data.attributes.Body}</div>`,
      });
    } else {
      setSource({
        html: `<div style='color: ${COLORS.white}; text-align: left'><b>${t(
          'common:noData',
        )}</div>`,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const onPressBack = () => {
    navigation.goBack();
  };

  return (
    <HeroContainer
      title={t('more:privacyPolicyButton')}
      onPressBack={onPressBack}>
      <View style={[styles.container]}>
        <View>
          <RenderHtml contentWidth={METRICS.screenWidth} source={source} />
        </View>
      </View>
    </HeroContainer>
  );
}

export default PrivacyPolicyScreen;
