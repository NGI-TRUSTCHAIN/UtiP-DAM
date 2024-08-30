import '../../assets/css/payButton.css';

import React from 'react';

const PayButton = ({ children, customCss, textSize = 'sm' }) => {
  return (
    <button
      name="pay-button"
      className={`rounded-full relative w-[9rem] h-8 cursor-pointer flex justify-center items-center border border-blue-700 bg-blue-700 group hover:bg-blue-500 active:bg-blue-500 active:border-blue-500 my-5 ${customCss}`}>
      <span
        className={`text-white-900 text-${textSize} font-semibold transform group-hover:translate-x-22 transition-all duration-200`}>
        {children}
      </span>
      <span className="absolute left-0 h-full  w-8 rounded-full bg-blue-700 hover:bg-blue-800 hover:shadow-lg hover:ring-1 hover:ring-blue-400 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-200">
        <svg className={`svg w-4`} width="1em" height="1em" viewBox="0 0 24 24">
          <g fill="none" fillRule="evenodd">
            <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
            <path
              fill="white"
              d="M19 4a3 3 0 0 1 2.995 2.824L22 7v10a3 3 0 0 1-2.824 2.995L19 20H5a3 3 0 0 1-2.995-2.824L2 17V7a3 3 0 0 1 2.824-2.995L5 4zm1 6H4v7a1 1 0 0 0 .883.993L5 18h14a1 1 0 0 0 .993-.883L20 17zm-5.293 1.464l1.828 1.829a1 1 0 0 1 0 1.414l-1.828 1.828a1 1 0 1 1-1.414-1.414l.12-.121H9a1 1 0 1 1 0-2h4.414l-.121-.121a1 1 0 0 1 1.414-1.415M19 6H5a1 1 0 0 0-1 1v1h16V7a1 1 0 0 0-1-1"
            />
          </g>
        </svg>
        {/* <svg
          className={`svg w-4 text-white`}
          fill="none"
          height={textSize === 'sm' ? '10' : '20'}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 20 20"
          width={textSize === 'sm' ? '20' : '10'}
          xmlns="http://www.w3.org/2000/svg">
          <line x1="5" x2="15" y1="10" y2="10"></line>
        </svg> */}
      </span>
    </button>
  );
};

export default PayButton;
