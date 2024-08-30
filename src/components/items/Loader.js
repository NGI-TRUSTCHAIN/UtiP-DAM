import React from 'react';

export const Loader = ({
  fixed = true,
  size,
  className,
  message = undefined,
}) => {
  if (!fixed) {
    return (
      <div
        className={
          'inline-flex items-center justify-center w-full ' + className
        }>
        <span
          className={`loading loading-ring loading-sm ${
            size ? 'loading-' + size : 'loading-md'
          }`}
        />
        <span className="ml-2">{message}</span>
      </div>
    );
  }
  return (
    <div className={'fixed left-1/2 top-1/2 z-[9999999999]' + className}>
      <span
        className={`loading loading-bars loading-lg ${size ? 'loading-' + size : undefined}`}
      />{' '}
      {message}
    </div>
  );
};

export default Loader;
