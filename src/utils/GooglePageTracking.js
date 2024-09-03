import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GooglePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-W793JMV495', {
        page_path: location.pathname,
      });
    }
  }, [location]);
};

export default GooglePageTracking;
