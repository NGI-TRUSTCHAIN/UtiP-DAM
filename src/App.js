import './assets/css/index.css';
import '/node_modules/flag-icons/css/flag-icons.min.css';

import React, { useEffect, useState } from 'react';

import Header from './components/defaultLayout/Header';
import { Outlet } from 'react-router-dom';
import TagManager from 'react-gtm-module';
import Toaster from './components/items/Toaster';
import { globalState } from './store/global';
import { useSelector } from 'react-redux';

TagManager.initialize({
  gtmId: 'GTM-W793JMV495',
  dataLayerName: 'PageDataLayer',
});

const App = () => {
  const toastersData = useSelector(globalState.getToastersData);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications(toastersData);
  }, [toastersData]);

  const removeNotification = (notificationToRemove) => {
    setNotifications(
      notifications.filter(
        (notification) => notification !== notificationToRemove
      )
    );
  };
  return (
    <div className="flex flex-col justify-stretch items-stretch w-screen h-screen overflow-hidden">
      <Header />
      <Outlet />
      {notifications?.length > 0 &&
        notifications.map((notification, index) => (
          <Toaster
            key={index}
            timeout={5000}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification)}
          />
        ))}
    </div>
  );
};

export default App;
