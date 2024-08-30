import React, { useState } from 'react';

const CopyText = ({ textToCopy }) => {
  const [buttonLabel, setButtonLabel] = useState('Copy');

  const handleCopy = () => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setButtonLabel('Copied!');

        setTimeout(() => {
          setButtonLabel('Copy');
        }, 2000);
      })
      .catch(() => {});
  };

  return (
    <button
      onClick={handleCopy}
      className={`btn-ghost btn-sm ${textToCopy === undefined ? 'btn-disabled' : ''}`}>
      {buttonLabel}
    </button>
  );
};

export default CopyText;
