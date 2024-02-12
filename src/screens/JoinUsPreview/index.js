import React from 'react';
import {useNavigation} from '@react-navigation/native';

import {styles} from '@styles';
import HeroContainer from '@containers/hero_container';

import {View, TouchableOpacity, ScrollView, I18nManager} from 'react-native';
import CustomText from '@components/custom/custom_text';
import Button from '@components/atoms/button';
import {METRICS} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import {getDropdownCountries} from '@stores/selectors';
import {useStateIfMounted} from 'use-state-if-mounted';
import Icon from '@components/atoms/icon';
import RadioButtonGroup from '@components/atoms/radio_button_group';

import {useDispatch, useSelector} from 'react-redux';
import {getApplyInfo} from '@stores/selectors';
import {setApplyInfo} from '@stores/slices/applyInfo';
import CustomImage from '@components/custom/custom_image';
import {JoinUs} from '@config/functions';
import {t} from 'i18next';
import moment from 'moment';

function JoinUsPreview(props) {
  const navigation = useNavigation();
  const applyInfo = useSelector(getApplyInfo);
  const countries = useSelector(getDropdownCountries);
  const your_country = countries.find(
    c => c.value === applyInfo.CurrentCountry,
  );

  const moveToNextStep = async () => {
    const res = await JoinUs(applyInfo);
    if (res.status === 200) {
      navigation.navigate('JoinUsSuccess');
    }
  };
  const onPressBack = () => {
    navigation.goBack();
  };

  const bottomButton = (
    <View
      style={[styles.container, {position: 'absolute', bottom: 20, zIndex: 1}]}>
      <View style={[styles.buttonRow]}>
        <Button
          content={t('joinUs:confirmAndSendButton')}
          variant="solid"
          size="normal"
          fullWidth={true}
          onPress={moveToNextStep}
        />
      </View>
    </View>
  );

  return (
    <HeroContainer
      title={t('more:joinOurTeamLabelSmall')}
      onPressBack={onPressBack}
      bottomButton={bottomButton}>
      <View style={[styles.container, styles.flex]}>
        <View
          style={{
            marginVertical: METRICS.spaceNormal,
            alignItems: 'flex-start',
          }}>
          <CustomText style={[styles.fontSize.normal, styles.fontWeight.fw600]}>
            {t('joinUs:yourInfoLabel')}
          </CustomText>
        </View>

        <View style={styles.modalRow}>
          <View style={[styles.rowContainer, styles.alignCenter]}>
            <CustomText
              style={[styles.fontSize.normal, {marginLeft: METRICS.spaceTiny}]}>
              {t('joinUs:previewNameLabel')}
            </CustomText>
          </View>
          <CustomText
            style={[
              styles.fontSize.normal,
            ]}>{`${applyInfo.FirstName} ${applyInfo.LastName}`}</CustomText>
        </View>

        <View style={styles.modalRow}>
          <View style={[styles.rowContainer, styles.alignCenter]}>
            <CustomText
              style={[styles.fontSize.normal, {marginLeft: METRICS.spaceTiny}]}>
              {t('joinUs:previewPhoneLabel')}
            </CustomText>
          </View>
          <CustomText
            style={[styles.fontSize.normal]}>{`${applyInfo.Phone}`}</CustomText>
        </View>

        <View style={styles.modalRow}>
          <View style={[styles.rowContainer, styles.alignCenter]}>
            <CustomText
              style={[styles.fontSize.normal, {marginLeft: METRICS.spaceTiny}]}>
              {t('joinUs:previewEmailLabel')}
            </CustomText>
          </View>
          <CustomText
            style={[styles.fontSize.normal]}>{`${applyInfo.Email}`}</CustomText>
        </View>

        <View style={styles.modalRow}>
          <View style={[styles.rowContainer, styles.alignCenter]}>
            <CustomText
              style={[styles.fontSize.normal, {marginLeft: METRICS.spaceTiny}]}>
              {t('joinUs:previewCountryLabel')}
            </CustomText>
          </View>
          <View
            style={[
              styles.rowContainer,
              styles.alignCenter,
              styles.justifyBetween,
            ]}>
            <CustomImage
              style={[styles.optionFlag]}
              source={{uri: your_country.img}}
              resizeMode="contain"
            />
            <CustomText
              style={[
                styles.fontSize.normal,
              ]}>{`${your_country.label}`}</CustomText>
          </View>
        </View>

        <View style={styles.modalRow}>
          <View style={[styles.rowContainer, styles.alignCenter]}>
            <CustomText
              style={[styles.fontSize.normal, {marginLeft: METRICS.spaceTiny}]}>
              {t('joinUs:previewCityLabel')}
            </CustomText>
          </View>
          <CustomText
            style={[
              styles.fontSize.normal,
            ]}>{`${applyInfo.CurrentCity}`}</CustomText>
        </View>

        <View style={styles.modalRow}>
          <View style={[styles.rowContainer, styles.alignCenter]}>
            <CustomText
              style={[styles.fontSize.normal, {marginLeft: METRICS.spaceTiny}]}>
              {t('joinUs:previewCurrentJobLabel')}
            </CustomText>
          </View>
          <CustomText
            style={[
              styles.fontSize.normal,
            ]}>{`${applyInfo.CurrentJob}`}</CustomText>
        </View>

        <View style={styles.modalRow}>
          <View style={[styles.rowContainer, styles.alignCenter]}>
            <CustomText
              style={[styles.fontSize.normal, {marginLeft: METRICS.spaceTiny}]}>
              {t('joinUs:previewDobLabel')}
            </CustomText>
          </View>
          <CustomText style={[styles.fontSize.normal]}>{`${moment(
            applyInfo.DOB,
          ).format('YYYY-MM-DD')}`}</CustomText>
        </View>

        <View style={styles.modalRow}>
          <View style={[styles.rowContainer, styles.alignCenter]}>
            <CustomText
              style={[styles.fontSize.normal, {marginLeft: METRICS.spaceTiny}]}>
              {t('joinUs:previewGenderLabel')}
            </CustomText>
          </View>
          <CustomText style={[styles.fontSize.normal]}>
            {t(`common:gender${applyInfo.Gender}`)}
          </CustomText>
        </View>

        <View style={styles.modalRow}>
          <View style={[styles.rowContainer, styles.alignCenter]}>
            <CustomText
              style={[styles.fontSize.normal, {marginLeft: METRICS.spaceTiny}]}>
              {t('joinUs:previewRoleLabel')}
            </CustomText>
          </View>
          <CustomText style={[styles.fontSize.normal]}>
            {t(`joinUs:role${applyInfo.Role}`)}
          </CustomText>
        </View>
      </View>
    </HeroContainer>
  );
}

export default JoinUsPreview;
