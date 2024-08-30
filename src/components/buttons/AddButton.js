import React from 'react';

const AddButton = ({ children, customCss, textSize = 'sm' }) => {
  return (
    <button
      name="add-button"
      className={`rounded-full relative w-3/5 h-10 cursor-pointer flex justify-center items-center border border-blue-500 bg-blue-500 group hover:bg-blue-500 active:bg-blue-500 active:border-blue-500 my-5 ${customCss}`}>
      <span
        className={`text-white-900 text-${textSize} font-semibold transform group-hover:translate-x-20 transition-all duration-300`}>
        {children}
      </span>
      <span className="absolute left-0 h-full w-10 rounded-full bg-blue-500 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300">
        <svg
          className={`svg w-4 text-white`}
          fill="none"
          height={textSize === 'sm' ? '10' : '20'}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
          viewBox="0 0 20 20"
          width={textSize === 'sm' ? '10' : '20'}
          xmlns="http://www.w3.org/2000/svg">
          <line x1="12" x2="12" y1="5" y2="19"></line>
          <line x1="5" x2="19" y1="12" y2="12"></line>
        </svg>
      </span>
    </button>
  );
};

export default AddButton;
