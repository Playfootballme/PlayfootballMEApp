import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import ListContainer from '@containers/list_container';
import {useSelector} from 'react-redux';
import {getCountry} from '@stores/selectors';
import {t} from 'i18next';
import {GetFields} from '@config/functions';
import {getLanguage} from '../../stores/selectors';

function FieldsScreen(props) {
  const [fetching, setFetching] = useState(false);

  const navigation = useNavigation();

  const countryCode = useSelector(getCountry);
  const currentLang = useSelector(getLanguage);

  const [data, setData] = useState([]);

  const getFieldsHandler = async () => {
    setFetching(true);
    const response = await GetFields(countryCode, currentLang);
    if (response.status === 200) {
      setData(response.data.data.data);
      setFetching(false);
    }
  };
  useEffect(() => {
    getFieldsHandler();
  }, []);

  const fieldPickerHandler = fieldID => {
    const field = data.find(this_field => this_field.id === fieldID);

    navigation.navigate('FieldStack', {
      screen: 'FieldScreen',
      params: {field},
    });
  };

  return (
    <ListContainer
      title={t('common:fields')}
      subTitle={` ${t('common:inLabel')} ${t(`joinUs:${countryCode}`)}`}
      data={data}
      fieldPickerHandler={fieldPickerHandler}
      onRefresh={getFieldsHandler}
      fetching={fetching}
      dataType="fields"
      emptyString={t('tournaments:noUpcoming')}
    />
  );
}

export default FieldsScreen;
