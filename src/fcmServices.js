import {Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';

class FCMServices {
  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister);
    this.createNotificationListener(onRegister, onNotification, onOpenNotification);
  };

  registerAppWithFCM = async () => {
    if (Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages();
      await messaging().setAutoInitEnabled();
    }
  };

  checkPermission = (onRegister) => {
    messaging()
      .hasPermission()
      .then((enabled) => {
        if (enabled) {
          // user has permission
          this.getToken(onRegister);
        } else {
          // user doesnt have permission
          this.requestPermission(onRegister);
        }
      })
      .catch((error) => {
        console.log('[FCMServices], Permission Rejected', error);
      });
  };

  getToken = (onRegister) => {
    messaging()
      .getToken()
      .then((fcmToken) => {
        if (fcmToken) {
         onRegister(fcmToken);
        } else {
          console.log('[FCMServices] User doesnt have devices token');
        }
      })
      .catch((error) => {
        console.log('[FCMServices], getToken Rejected', error);
      });
  };

  requestPermission = (onRegister) => {
    messaging()
      .requestPermission()
      .then(() => {
        this.getToken(onRegister);
      })
      .catch((error) => {
        console.log('[FCMServices], Permission Rejected', error);
      });
  };

  deleteToken = () => {
    console.log('[FCMServices], Delete token');
    messaging()
      .deleteToken()
      .catch((error) => {
        console.log('[FCMServices], deleteToken Error', error);
      });
  };

  createNotificationListener = (
    onRegister,
    onNotification,
    onOpenNotification,
  ) => {
    // when app is runing,but in he background
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('[FCMServices], Notification caused app from background');
      if (remoteMessage) {
        notification = remoteMessage.notification;
        onOpenNotification(notification);
      }
    });

    this.messageListener = messaging().onMessage(async (remoteMessage) => {
      console.log('[FCMServices], a new FCM is arrived', remoteMessage);
      if (remoteMessage) {
        let notification = null;
        if (Platform.OS === 'ios') {
          notification = remoteMessage.data.notification;
        } else {
          notification = remoteMessage.notification;
        }
        onNotification(notification);
      }
    });

    // when app is opened from quit state
    messaging().getInitialNotification((remoteMessage) => {
      console.log(
        '[FCMServices], getInitialNotification caused app from quit state',
      );
      if (remoteMessage) {
        notification = remoteMessage.notification;
        onOpenNotification(notification);
      }
    });

    //   trigered when have new token
    messaging().onTokenRefresh((fcmToken) => {
      console.log('[FCMServices], newtoken refresh', fcmToken);
      onRegister(fcmToken);
    });
  };
  // foreground state messages
  unRegister = () => {
    this.messageListener();
  };
}

export const fcmServices = new FCMServices();
