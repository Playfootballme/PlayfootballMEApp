import React from 'react';
import {useNavigation, CommonActions} from '@react-navigation/native';

import BlankContainer from '@containers/blank_container';

import {styles} from '@styles';
import {View} from 'react-native';
import CustomText from '@components/custom/custom_text';
import {METRICS} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import Button from '@components/atoms/button';
import Icon from '@components/atoms/icon';
import {useDispatch, useSelector} from 'react-redux';
import {getApplyInfo} from '@stores/selectors';
import {setApplyInfo} from '@stores/slices/applyInfo';
import {t} from 'i18next';
function JoinUsSuccess(props) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const goToMore = () => {
    dispatch(
      setApplyInfo({
        FirstName: null,
        LastName: null,
        Email: null,
        Phone: null,
        CurrentCountry: null,
        CurrentCity: null,
        Role: null,
        DOB: null,
        Gender: null,
        CurrentJob: null,
      }),
    );
    navigation.replace('TabsStack', {
      screen: 'MoreScreen',
    });
  };

  return (
    <BlankContainer>
      <View style={[styles.flex, styles.container]}>
        <View style={[styles.flex, styles.alignCenter, styles.justifyCenter]}>
          <View
            style={[
              styles.modalConfirmIcon,
              {marginBottom: METRICS.spaceSmall},
            ]}>
            <Icon name={'checkmark'} size={100} color={COLORS.white} />
          </View>
          <CustomText
            style={[
              styles.fontSize.compact,
              styles.fontWeight.fw600,
              {textAlign: 'center', marginBottom: METRICS.spaceCompact},
            ]}>
            {t('joinUs:thankYou')}
          </CustomText>

          <Button
            content={t('matches:doneButton')}
            onPress={goToMore}
            variant="solid"
            size="normal"
            fullWidth
          />
        </View>
      </View>
    </BlankContainer>
  );
}

export default JoinUsSuccess;
