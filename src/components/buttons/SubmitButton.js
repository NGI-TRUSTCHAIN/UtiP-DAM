import React from 'react';

const SubmitButton = ({ customCss, children }) => {
  return (
    <button
      name="submit-button"
      className={`rounded-full relative w-3/5 h-10 btn-primary bg-secondary-700 hover:bg-secondary-700 hover:shadow-xl active:bg-secondary-900 active:border-secondary-900 my-5 text-primary ring-1 ring-gray-500 ring-offset-3 ${customCss}`}>
      {children}
    </button>
  );
};

export default SubmitButton;
