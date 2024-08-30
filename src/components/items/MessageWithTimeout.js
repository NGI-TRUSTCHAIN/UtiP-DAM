import React, { useEffect, useState } from 'react';

const MessageWithTimeout = ({
  message,
  timeout = 3000,
  className,
  children,
  onClose = undefined,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (timeout) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, timeout);

      return () => {
        clearTimeout(timer);
        if (onClose) onClose();
      };
    }
  }, [timeout]);

  return (
    <>
      {isVisible && (
        <div className={`p-4 ${className}`}>{message || children}</div>
      )}
    </>
  );
};

export default MessageWithTimeout;
