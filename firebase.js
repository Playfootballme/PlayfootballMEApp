import {Platform, PermissionsAndroid, NativeModules} from 'react-native';

import messaging from '@react-native-firebase/messaging';

import {UpdateFCM} from '@config/functions';
import {mode} from '@env';

export const requestUserPermission = async (
  userID = false,
  JWT = false,
  country = 'JO',
  lang = 'en',
) => {
  // console.log('dev_mode', mode);
  if (Platform.OS === 'android') {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    getToken().then(async fcm => {
      if (mode === 'dev') {
        subscribeToTopic('allDevices_dev');
      } else {
        if (country === 'JO') {
          if (lang === 'ar') {
            subscribeToTopic('allDevices_AR_JO');
            unsubscribeFromTopic('allDevices_JO');
            unsubscribeFromTopic('allDevices_AR_QA');
            unsubscribeFromTopic('allDevices_QA');
            unsubscribeFromTopic('allDevices_dev');
          } else {
            subscribeToTopic('allDevices_JO');
            unsubscribeFromTopic('allDevices_AR_JO');
            unsubscribeFromTopic('allDevices_AR_QA');
            unsubscribeFromTopic('allDevices_QA');
            unsubscribeFromTopic('allDevices_dev');
          }
        } else {
          if (lang === 'ar') {
            subscribeToTopic('allDevices_AR_QA');
            unsubscribeFromTopic('allDevices_QA');
            unsubscribeFromTopic('allDevices_AR_JO');
            unsubscribeFromTopic('allDevices_JO');
            unsubscribeFromTopic('allDevices_dev');
          } else {
            subscribeToTopic('allDevices_QA');
            unsubscribeFromTopic('allDevices_AR_QA');
            unsubscribeFromTopic('allDevices_AR_JO');
            unsubscribeFromTopic('allDevices_JO');
            unsubscribeFromTopic('allDevices_dev');
          }
        }
      }

      if (fcm && userID) {
        const res = await UpdateFCM(userID, JWT, fcm, country);
        if (res.status === 200) {
          console.log(`User ${userID} updated!`);
          // console.log('Authorization status:', authStatus);
        }
      }
    });
  }
};

export const getToken = async () => {
  let fcmToken = await messaging().getToken();
  if (fcmToken) {
    return fcmToken;
  } else {
    return null;
  }
};

const subscribeToTopic = async topic => {
  await messaging().subscribeToTopic(topic);
  console.log(`Subscribed to topic "${topic}"`);
};

const unsubscribeFromTopic = async topic => {
  await messaging().unsubscribeFromTopic(topic);
  // console.log(`Subscribed to topic "${topic}"`);
};

messaging().onTokenRefresh(fcmToken => {
  console.log('New token received:', fcmToken);
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

messaging().onMessage(async remoteMessage => {
  console.log('Message received!', remoteMessage);
  // Add your own notification handling logic here
});

// Only for Android
if (Platform.OS === 'android') {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage,
    );
  });
}

// Only for iOS
// if (Platform.OS === 'ios') {
//   messaging().setForegroundNotificationPresentationOptions({
//     alert: true,
//     badge: true,
//     sound: true,
//   });
// }
