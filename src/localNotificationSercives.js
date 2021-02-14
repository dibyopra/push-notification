import {Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';

class LocalNotificationServices {
  configure = (onOpenNotification) => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('[LocalNotificationServices] onRegister:', token);
      },
      onNotification: function (notification) {
        console.log(
          '[LocalNotificationServices] onNotification:',
          notification,
        );
        if (!notification.data) {
          return;
        }
        notification.userInteraction = true;
        onOpenNotification(notification.data);
      },
      // should notification be popped automatically
      // default true
      popInitialNotification: true,
    });
  };

  unRegister = () => {
    PushNotification.unregister();
  };

  showNotification = (id, title, message, data = {}, options = {}) => {
    PushNotification.localNotification({
      // android only propeties
      ...this.buildAndroidNotification(id, title, message, data, options),
      // ios and android properties
      title: title || '',
      message: message || '',
      playSound: options.playSound || false,
      soundName: options.soundName || 'default',
      userInteraction: false, //BOOLEAN : if the notification was opened by the user from the notification
    });
  };

  buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
    return {
      id,
      autoCancel: true,
      largeIcon: options.largeIcon || 'ic_launcher',
      smallIcon: options.smallIcon || 'ic_notification',
      bigText: message || '',
      subText: title || '',
      vibrate: options.vibrate || true,
      vibration: options.vibration || 300,
      priority: options.priority || 'high',
      importance: options.importance || 'hight',
      data,
    };
  };

  cancelAllLocalNotification = () => {
    PushNotification.cancelAllLocalNotifications();
  };

  removeDeliveredNotificationByID = (notificationId) => {
    console.log('[LocalNotificationServices] removeDeliveredNotificationByID:', notificationId);
    PushNotification.cancelLocalNotifications({id:notificationId})
  }

}
export const localNotificationServices = new LocalNotificationServices()