import React, {useEffect} from 'react';
import {View, Button} from 'react-native';
import {fcmServices} from './src/fcmServices';
import {localNotificationServices} from './src/localNotificationSercives';

const App = () => {
  useEffect(() => {
    fcmServices.registerAppWithFCM();
    fcmServices.register(onRegister, onNotification, onOpenNotification);
    localNotificationServices.configure(onOpenNotification);

    function onRegister(token) {
      console.log('[App], onRegister: ', token);
    }

    function onNotification(notify) {
      console.log('[App], onNotification: ', notify);
      const options = {
        playSound: true,
      };
      localNotificationServices.showNotification(
        0,
        notify.title,
        notify.body,
        notify,
        options,
      );
    }

    return () => {
      console.log('[App], unRegistered');
      fcmServices.unRegister();
      localNotificationServices.unRegister();
    };
  }, []);

  function onOpenNotification(notify) {
    console.log('[App], onOpenNotification: ', notify);
    alert('Open Notification: ' + notify.body);
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button title="Press me" onPress={() => console.log('Hello')} />
    </View>
  );
};

export default App;
