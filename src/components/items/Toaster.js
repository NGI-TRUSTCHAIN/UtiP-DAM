import { MdClose } from 'react-icons/md';
import MessageWithTimeout from './MessageWithTimeout';
import React from 'react';

const Toaster = ({ message, timeout, type, onClose }) => {
  const alertColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-success/80 border-green-500';
      case 'error':
        return 'bg-error/80 border-error';
      case 'warning':
        return 'bg-accent/70 border-accent-dark/50';
      case 'info':
        return 'bg-info/80 border-sky-300 ';
      default:
        return 'bg-neutral/70 border-slate-300';
    }
  };

  return (
    <MessageWithTimeout
      timeout={timeout || false}
      className="text-sm px-0 py-0 capitalize">
      <div className="toast toast-bottom toast-start">
        <div
          className={`alert ${alertColor(type)} border-spacing-1 shadow-lg font-medium text-xs`}>
          <span>{message}</span>
          <button className="btn btn-sm btn-ghost btn-circle" onClick={onClose}>
            <MdClose />
          </button>
        </div>
      </div>
    </MessageWithTimeout>
  );
};

export default Toaster;
