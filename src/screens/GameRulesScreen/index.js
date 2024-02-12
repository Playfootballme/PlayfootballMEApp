import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

import HeroContainer from '@containers/hero_container';

import {apiEndpoint} from '@config/functions';
import {useStateIfMounted} from 'use-state-if-mounted';
import {t} from 'i18next';
import {useSelector} from 'react-redux';
import {getLanguage} from '@stores/selectors';
import {rootURL} from '@config/functions';
import PDFReader from '@components/atoms/pdf_reader';
function GameRulesScreen(props) {
  const currentLang = useSelector(getLanguage);
  const navigation = useNavigation();
  const [source, setSource] = useStateIfMounted('');
  const fetchData = async () => {
    const response = await fetch(
      `${apiEndpoint}/terms-and-condition?locale=${currentLang}&populate[0]=GameRulesNotebook`,
    );
    const data = await response.json();
    if (data.data) {
      if (data.data.attributes?.GameRulesNotebook?.data) {
        setSource(
          rootURL +
            data.data.attributes?.GameRulesNotebook?.data?.attributes?.url,
        );
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const onPressBack = () => {
    navigation.goBack();
  };

  return (
    <HeroContainer title={t('more:rulesBook')} onPressBack={onPressBack}>
      <PDFReader source={source} />
    </HeroContainer>
  );
}

export default GameRulesScreen;
