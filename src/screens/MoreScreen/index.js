import React, {useEffect} from 'react';
import {useNavigation, CommonActions} from '@react-navigation/native';

import HeroContainer from '@containers/hero_container';
import {
  View,
  TouchableOpacity,
  Linking,
  Alert,
  ImageBackground,
  I18nManager,
} from 'react-native';

import {METRICS} from '@theme/metrics';
import {styles} from '@styles';
import CustomText from '@components/custom/custom_text';
import Avatar from '@components/atoms/avatar';
import Button from '@components/atoms/button';
import RadioButtonGroup from '@components/atoms/radio_button_group';
import Icon from '@components/atoms/icon';
import {useSelector, useDispatch} from 'react-redux';
import {
  getLanguage,
  getTheme,
  getAvailableThemes,
  getAvailableLanguages,
  getMe,
  getCountry,
} from '@stores/selectors';
import {apiEndpoint, rootURL, removeData, storeData} from '@config/functions';
import {setTheme} from '@stores/slices/theme';
import {setLanguage} from '@stores/slices/language';
import {setCountry, setCurrency, setTimezone} from '@stores/slices/country';
import {logout} from '@stores/slices/authUser';

import {COLORS} from '@theme/colors';

import RNRestart from 'react-native-restart';
import CustomImage from '@components/custom/custom_image';
import {useStateIfMounted} from 'use-state-if-mounted';
import {t} from 'i18next';

function MoreScreen(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [phone, setPhone] = useStateIfMounted(null);
  const [whatsappLink, setWhatsappLink] = useStateIfMounted(null);
  const [instagramLink, setInstagramLink] = useStateIfMounted(null);
  const [facebookLink, setFacebookLink] = useStateIfMounted(null);
  const [YoutubeLink, setYoutubeLink] = useStateIfMounted(null);
  const [TikTokLink, setTikTokLink] = useStateIfMounted(null);
  const [WebsiteLink, setWebsiteLink] = useStateIfMounted(null);

  const countryCode = useSelector(getCountry);
  const fetchData = async () => {
    const response = await fetch(`${apiEndpoint}/general-setting`);
    const data = await response.json();
    setPhone(data.data?.attributes[`${countryCode}_Phone`]);
    setInstagramLink(data.data?.attributes[`${countryCode}_InstagramLink`]);
    setTikTokLink(data.data?.attributes[`${countryCode}_TikTokLink`]);
    setFacebookLink(data.data?.attributes[`${countryCode}_FacebookLink`]);
    setYoutubeLink(data.data?.attributes[`${countryCode}_YoutubeLink`]);
    setWhatsappLink(data.data?.attributes[`${countryCode}_WhatsappLink`]);
    setWebsiteLink(data.data?.attributes.WebsiteLink);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const availableLanguages = useSelector(getAvailableLanguages);
  const availableThemes = useSelector(getAvailableThemes);
  const currentLang = useSelector(getLanguage);
  const currentTheme = useSelector(getTheme);
  const Me = useSelector(getMe);

  const [modalIsActive, setModalIsActive] = useStateIfMounted(false);

  const [modalTitle, setModalTitle] = useStateIfMounted(''); // ['Language', 'Theme'
  const [modalDescription, setModalDescription] = useStateIfMounted(''); // ['Select your preferred language', 'Select your preferred theme'
  const [modalOptions, setModalOptions] = useStateIfMounted([]);

  const dispatchHandler = async value => {
    if (modalTitle === t('more:languageTitle')) {
      setModalOptions([
        {
          value: availableLanguages[0].value,
          label: t(`more:language${availableLanguages[0].label}`),
          isSelected: value === 'en',
        },
        {
          value: availableLanguages[1].value,
          label: t(`more:language${availableLanguages[1].label}`),
          isSelected: value === 'ar',
        },
      ]);

      Alert.alert(t('common:restartRequired'), t('more:alertLanguageChange'), [
        {
          text: t('common:restartApprove'),
          style: 'cancel',
          onPress: async () => {
            // dispatch(setLanguage(value));
            await storeData('currentLang', JSON.stringify(value));
            setModalIsActive(!modalIsActive);
            I18nManager.allowRTL(value === 'ar');
            I18nManager.forceRTL(value === 'ar');
            I18nManager.swapLeftAndRightInRTL(value === 'ar');
            setTimeout(() => {
              RNRestart.restart();
            }, 500);
          },
        },
        {
          text: t('common:cancel'),
          onPress: () => {
            setModalOptions([
              {
                label: t(`more:language${availableLanguages[0].label}`),
                value: 'en',
                isSelected: currentLang === 'en',
              },
              {
                label: t(`more:language${availableLanguages[1].label}`),
                value: 'ar',
                isSelected: currentLang === 'ar',
              },
            ]);
            setModalIsActive(!modalIsActive);
          },
          style: 'cancel',
        },
      ]);
      return;
    } else if (modalTitle === 'Theme') {
      setModalOptions([
        {
          ...availableThemes[0],
          isSelected: value === 'light',
        },
        {
          ...availableThemes[1],
          isSelected: value === 'dark',
        },
      ]);
      dispatch(setTheme(value));
    } else if (modalTitle === t('more:countryTitle')) {
      setModalOptions([
        {
          label: t('more:countryJordan'),
          img: require('@assets/images/jordan.png'),
          value: 'JO',
          isSelected: value === 'JO',
        },
        {
          label: t('more:countryQatar'),
          img: require('@assets/images/qatar.png'),
          value: 'QA',
          isSelected: value === 'QA',
        },
      ]);

      Alert.alert(t('common:restartRequired'), t('more:alertCountryChange'), [
        {
          text: t('common:restartApprove'),
          style: 'cancel',
          onPress: async () => {
            await storeData('countryCode', JSON.stringify(value));
            dispatch(setCountry(value));
            dispatch(setCurrency(value === 'JO' ? 'JOD' : 'QR'));
            dispatch(setTimezone(value === 'JO' ? 3 : 3));
            setModalIsActive(!modalIsActive);
            setTimeout(() => {
              RNRestart.restart();
            }, 500);
          },
        },
        {
          text: t('common:cancel'),
          onPress: () => {
            setModalOptions([
              {
                label: t('more:countryJordan'),
                img: require('@assets/images/jordan.png'),
                value: 'JO',
                isSelected: countryCode === 'JO',
              },
              {
                label: t('more:countryQatar'),
                img: require('@assets/images/qatar.png'),
                value: 'QA',
                isSelected: countryCode === 'QA',
              },
            ]);
            setModalIsActive(!modalIsActive);
          },
          style: 'cancel',
        },
      ]);

      return;
    }
  };

  const modalBody = (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
      <View style={{alignItems: 'flex-start'}}>
        <CustomText
          style={[
            styles.fontSize.compact,
            styles.fontWeight.fw600,
            {marginBottom: METRICS.spaceSmall},
          ]}>
          {modalTitle ? modalTitle : 'Enter title'}
        </CustomText>
        <CustomText
          style={[styles.fontSize.small, {marginBottom: METRICS.spaceMedium}]}>
          {modalDescription ? modalDescription : 'Enter description'}
        </CustomText>
      </View>

      <View style={styles.buttonRowFirst}>
        <RadioButtonGroup options={modalOptions} onChange={dispatchHandler} />
      </View>
    </View>
  );

  return (
    <HeroContainer
      title={t('more:mainTitle')}
      modalIsActive={modalIsActive}
      setModalIsActive={() => {
        setModalIsActive(!modalIsActive);
        setTimeout(() => {
          setModalOptions([]);
          setModalTitle('');
        }, 500);
      }}
      modalStyle={'halfWithEdge'}
      modalBody={modalBody}>
      {/* Profile Avatar */}

      {Me.data ? (
        <View
          style={[
            styles.container,
            styles.rowContainer,
            styles.alignCenter,
            {marginBottom: METRICS.spaceLarge},
          ]}>
          <Avatar
            img={Me.data?.Image ? rootURL + Me.data.Image.url : null}
            name={`${Me.data?.FirstName} ${Me.data?.LastName}`}
            size="large"
          />
          <View
            style={{
              marginLeft: METRICS.spaceMedium,
              alignItems: 'flex-start',
            }}>
            <CustomText
              style={[
                styles.fontSize.medium,
                styles.fontWeight.fw600,
                {marginBottom: METRICS.spaceSmall},
              ]}>
              {`${Me.data?.FirstName} ${Me.data?.LastName}`}
            </CustomText>
            <Button
              content={t('more:viewProfileButton')}
              onPress={() => {
                navigation.navigate('ProfileStack', {
                  screen: 'ProfileScreen',
                });
              }}
              variant="link"
              size="small"
              textStyle={styles.fontWeight.fw600}
              noPadding
            />
          </View>
        </View>
      ) : (
        <View style={[styles.container, {marginBottom: METRICS.spaceLarge}]}>
          <Button
            content={t('more:signInButton')}
            onPress={() =>
              navigation.navigate('LandingStack', {
                screen: 'SignInScreen',
              })
            }
            variant="solid"
            size="normal"
            fullWidth
          />
        </View>
      )}

      <View
        style={[
          styles.container,
          {
            marginBottom: METRICS.spaceLarge,
            alignItems: 'flex-start',
          },
        ]}>
        <CustomText style={[styles.fontSize.small, styles.fontWeight.fw600]}>
          {t('more:appSettingsLabel')}
        </CustomText>
        <Button
          content={t('more:languageButton')}
          iconLeft={<Icon name="world-wide" size={20} color={COLORS.white} />}
          onPress={() => {
            setModalOptions([
              {
                value: availableLanguages[0].value,
                label: t(`more:language${availableLanguages[0].label}`),
                isSelected: currentLang === 'en',
              },
              {
                value: availableLanguages[1].value,
                label: t(`more:language${availableLanguages[1].label}`),
                isSelected: currentLang === 'ar',
              },
            ]);
            setModalTitle(t('more:languageTitle'));
            setModalDescription(t('more:languageDesc'));
            setModalIsActive(!modalIsActive);
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        />
        {/* <Button
          content={`Theme`}
          iconLeft={
            <Icon name="circle-half-stroke" size={20} color={COLORS.white} />
          }
          onPress={() => {
            setModalOptions([
              {
                ...availableThemes[0],
                isSelected: currentTheme === 'light',
              },
              {
                ...availableThemes[1],
                isSelected: currentTheme === 'dark',
              },
            ]);
            setModalTitle('Theme');
            setModalDescription('Select your preferred theme');
            setModalIsActive(!modalIsActive);
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        />   */}

        <Button
          content={t('more:countryButton')}
          iconLeft={<Icon name="map-marker" size={20} color={COLORS.white} />}
          onPress={() => {
            setModalOptions([
              {
                label: t('more:countryJordan'),
                img: require('@assets/images/jordan.png'),
                value: 'JO',
                isSelected: countryCode === 'JO',
              },
              {
                label: t('more:countryQatar'),
                img: require('@assets/images/qatar.png'),
                value: 'QA',
                isSelected: countryCode === 'QA',
              },
            ]);
            setModalTitle(t('more:countryTitle'));
            setModalDescription(t('more:countryDesc'));
            setModalIsActive(!modalIsActive);
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        />

        {/* <Button
          content={'Push Notifications'}
          iconLeft={<Icon name="bell" size={20} color={COLORS.white} />}
          onPress={() => {
            navigation.navigate('PushNotificationsStack', {
              screen: 'PushNotificationsScreen',
            });
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        /> */}
      </View>

      <View
        style={[
          styles.container,
          {
            marginBottom: METRICS.spaceLarge,
            alignItems: 'flex-start',
          },
        ]}>
        <CustomText style={[styles.fontSize.small, styles.fontWeight.fw600]}>
          {t('more:supportLabel')}
        </CustomText>
        <Button
          content={t('more:faqButton')}
          iconLeft={
            <Icon name="comment-question" size={20} color={COLORS.white} />
          }
          onPress={() => {
            navigation.navigate('FAQStack', {
              screen: 'FAQScreen',
            });
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        />
        {/* <Button
          content={'Chat'}
          iconLeft={<Icon name="comment" size={20} color={COLORS.white} />}
          onPress={() => {
            console.log('Chat');
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        /> */}
      </View>

      <View
        style={[
          styles.container,
          {
            marginBottom: METRICS.spaceLarge,
            alignItems: 'flex-start',
          },
        ]}>
        <CustomText style={[styles.fontSize.small, styles.fontWeight.fw600]}>
          {t('more:legalLabel')}
        </CustomText>
        <Button
          content={t('more:privacyPolicyButton')}
          iconLeft={
            <Icon name="privacy-policy" size={20} color={COLORS.white} />
          }
          onPress={() => {
            navigation.navigate('PrivacyPolicyStack', {
              screen: 'PrivacyPolicyScreen',
            });
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        />
        <Button
          content={t('more:termsAndCondButton')}
          iconLeft={
            <Icon name="clipboard-list" size={20} color={COLORS.white} />
          }
          onPress={() => {
            navigation.navigate('TermsConditionsStack', {
              screen: 'TermsConditionsScreen',
            });
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        />

        <Button
          content={t('more:rulesBook')}
          iconLeft={<Icon name="whistle" size={20} color={COLORS.white} />}
          onPress={() => {
            navigation.navigate('GameRulesStack', {
              screen: 'GameRulesScreen',
            });
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        />
      </View>

      <View
        style={[
          styles.container,
          {
            marginBottom: METRICS.spaceLarge,
            alignItems: 'flex-start',
          },
        ]}>
        <CustomText style={[styles.fontSize.small, styles.fontWeight.fw600]}>
          {t('more:joinOurTeamLabel')}
        </CustomText>
        {/* <Button
          content={t('more:ourTeamButtonLabel')}
          iconLeft={<Icon name="users-alt" size={20} color={COLORS.white} />}
          onPress={() => {
            navigation.navigate('StaffStack', {
              screen: 'StaffScreen',
            });
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        /> */}
        <Button
          content={t('more:applyNowButton')}
          iconLeft={<Icon name="id-badge" size={20} color={COLORS.white} />}
          onPress={() => {
            navigation.navigate('JoinUsStack', {
              screen: 'JoinUsSelectRole',
            });
          }}
          variant="link"
          size="normal"
          noPadding
          fullWidth
        />
      </View>

      <View
        style={[
          styles.flex,
          styles.container,
          styles.alignCenter,
          {marginBottom: METRICS.spaceLarge},
        ]}>
        <TouchableOpacity
          disabled={WebsiteLink === null}
          onPress={() => {
            Linking.openURL(WebsiteLink);
          }}>
          <CustomImage
            source={require('@assets/images/logo-white-full.png')}
            style={styles.mediumLogo}
          />
        </TouchableOpacity>
        <View
          style={[
            styles.flex,
            styles.rowContainer,
            styles.alignCenter,
            {marginTop: METRICS.spaceSmall},
          ]}>
          <View
            style={[styles.flex, styles.rowContainer, styles.justifyCenter]}>
            {phone && (
              <TouchableOpacity
                style={[styles.alignCenter, {marginRight: METRICS.spaceMedium}]}
                onPress={() => {
                  Linking.openURL(`tel:${phone}`);
                }}>
                <View style={[styles.iconCircle, styles.iconBackgroundCall]}>
                  <Icon name="call" size={18} color={COLORS.white} />
                </View>
                <CustomText style={[styles.fontSize.tiny, {marginTop: 5}]}>
                  Call
                </CustomText>
              </TouchableOpacity>
            )}

            {whatsappLink && (
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(whatsappLink);
                }}
                style={[
                  styles.alignCenter,
                  {marginRight: METRICS.spaceMedium},
                ]}>
                <View
                  style={[styles.iconCircle, styles.iconBackgroundWhatsapp]}>
                  <Icon name="whatsapp" size={18} color={COLORS.white} />
                </View>
                <CustomText style={[styles.fontSize.tiny, {marginTop: 5}]}>
                  Whatsapp
                </CustomText>
              </TouchableOpacity>
            )}
            {instagramLink && (
              <TouchableOpacity
                style={[styles.alignCenter, {marginRight: METRICS.spaceMedium}]}
                onPress={() => {
                  Linking.openURL(instagramLink);
                }}>
                <ImageBackground
                  source={require('@assets/images/instagram-bg.jpg')}
                  resizeMode="cover"
                  style={[styles.iconCircle]}>
                  <Icon name="instagram" size={18} color={COLORS.white} />
                </ImageBackground>
                <CustomText style={[styles.fontSize.tiny, {marginTop: 5}]}>
                  Instagram
                </CustomText>
              </TouchableOpacity>
            )}
            {facebookLink && (
              <TouchableOpacity
                style={[styles.alignCenter, {marginRight: METRICS.spaceMedium}]}
                onPress={() => {
                  Linking.openURL(facebookLink);
                }}>
                <View
                  style={[styles.iconCircle, styles.iconBackgroundFacebook]}>
                  <Icon name="facebook" size={18} color={COLORS.white} />
                </View>
                <CustomText style={[styles.fontSize.tiny, {marginTop: 5}]}>
                  Facebook
                </CustomText>
              </TouchableOpacity>
            )}

            {TikTokLink && (
              <TouchableOpacity
                style={[styles.alignCenter, {marginRight: METRICS.spaceMedium}]}
                onPress={() => {
                  Linking.openURL(TikTokLink);
                }}>
                <View style={[styles.iconCircle, styles.iconBackgroundTikTok]}>
                  <Icon name="tiktok" size={18} color={COLORS.white} />
                </View>
                <CustomText style={[styles.fontSize.tiny, {marginTop: 5}]}>
                  TikTok
                </CustomText>
              </TouchableOpacity>
            )}

            {YoutubeLink && (
              <TouchableOpacity
                style={[styles.alignCenter]}
                onPress={() => {
                  Linking.openURL(YoutubeLink);
                }}>
                <View style={[styles.iconCircle, styles.iconBackgroundYoutube]}>
                  <Icon name="youtube" size={18} color={COLORS.white} />
                </View>
                <CustomText style={[styles.fontSize.tiny, {marginTop: 5}]}>
                  Youtube
                </CustomText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {Me.data && (
        <View style={[styles.container, {marginBottom: METRICS.spaceXXLarge}]}>
          <Button
            content={t('more:logOutButton')}
            onPress={() => {
              Alert.alert(t('more:logOutButton'), t('more:alertLogOutDesc'), [
                {
                  text: t('more:logOutButton'),
                  style: 'cancel',
                  onPress: async () => {
                    dispatch(logout());
                    await removeData('authUserJWT');

                    RNRestart.restart();
                  },
                },
                {
                  text: t('common:cancel'),
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
              ]);
            }}
            variant="cancel"
            size="normal"
            fullWidth
          />
        </View>
      )}
    </HeroContainer>
  );
}

export default MoreScreen;
