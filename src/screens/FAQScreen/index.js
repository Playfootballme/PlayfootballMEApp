import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

import HeroContainer from '@containers/hero_container';

import {styles} from '@styles';
import {View} from 'react-native';
import Accordion from '@components/atoms/accordion';
import {apiEndpoint} from '@config/functions';
import qs from 'qs';
import {useStateIfMounted} from 'use-state-if-mounted';
import {t} from 'i18next';
import {useSelector} from 'react-redux';
import {getLanguage} from '@stores/selectors';
import CustomText from '../../components/custom/custom_text';

function FAQScreen(props) {
  const navigation = useNavigation();
  const currentLang = useSelector(getLanguage);
  const [FAQs, setFAQs] = useStateIfMounted([]);

  const fetchData = async () => {
    const query = qs.stringify(
      {
        locale: currentLang,
        populate: ['FAQ'],
      },
      {
        encodeValuesOnly: true, // prettify URL
      },
    );

    const response = await fetch(`${apiEndpoint}/faq?${query}`);
    const data = await response.json();

    if (data.data) {
      const mapped = data.data.attributes.FAQ.map((item, index) => {
        return {
          title: item.Question,
          body: item.Answer,
          expanded: false,
        };
      });
      setFAQs(mapped);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const onPressBack = () => {
    navigation.goBack();
  };

  const expandAccordion = index => {
    setFAQs(
      FAQs.map((item, i) => {
        return {
          ...item,
          expanded: false,
        };
      }),
    );
    setFAQs(
      FAQs.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            expanded: !item.expanded,
          };
        }
        return {
          ...item,
          expanded: false,
        };
      }),
    );
  };

  return (
    <HeroContainer title={t('more:faqButton')} onPressBack={onPressBack}>
      <View style={[styles.container]}>
        {FAQs.length > 0 ? (
          FAQs.map((item, index) => {
            return (
              <Accordion
                key={index}
                index={index}
                title={item.title}
                body={item.body}
                expanded={item.expanded}
                expandAccordion={expandAccordion}
              />
            );
          })
        ) : (
          <CustomText style={[styles.fontSize.normal, {textAlign: 'center'}]}>
            {t('common:noData')}
          </CustomText>
        )}
      </View>
    </HeroContainer>
  );
}

export default FAQScreen;
