import React from 'react';

const NoData = ({ text, className }) => {
  return (
    <div className={`flex text-sm m-4 ${className}`}>
      {text || 'No data found.'}
    </div>
  );
};

export default NoData;
