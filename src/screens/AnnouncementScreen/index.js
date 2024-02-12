import React from 'react';
import {useNavigation} from '@react-navigation/native';
import HeroContainer from '@containers/hero_container';
import {styles} from '@styles';
import {View, Image} from 'react-native';

import RenderHtml from 'react-native-render-html';
import {METRICS} from '@theme/metrics';
import {COLORS} from '@theme/colors';
import {rootURL} from '@config/functions';
import {useSelector} from 'react-redux';
import {getAnnouncements, getLanguage} from '@stores/selectors';
import CustomImage from '@components/custom/custom_image';
import {useStateIfMounted} from 'use-state-if-mounted';

function AnnouncementScreen(props) {
  const {ID} = props.route.params;
  const navigation = useNavigation();
  const announcements = useSelector(getAnnouncements);
  const announcement = announcements.find(item => item.id === ID);
  const currentLang = useSelector(getLanguage);

  const [source, setSource] = useStateIfMounted({
    html: `<div style='color: ${COLORS.white}; text-align: left'>${announcement.attributes.Body}</div>`,
  });

  const onPressBack = () => {
    navigation.goBack();
  };

  return (
    <HeroContainer
      title={announcement.attributes.Title}
      onPressBack={onPressBack}>
      <View style={[styles.container]}>
        <View>
          <View
            style={{
              borderRadius: METRICS.borderRadius,
              overflow: 'hidden',
              marginBottom: METRICS.spaceNormal,
            }}>
            <CustomImage
              style={{
                height: 150,
              }}
              resizeMode="cover"
              source={{
                uri: `${rootURL}${announcement?.attributes?.Image?.data?.attributes?.url}`,
              }}
            />
          </View>
          <RenderHtml contentWidth={METRICS.screenWidth} source={source} />
        </View>
      </View>
    </HeroContainer>
  );
}

export default AnnouncementScreen;
