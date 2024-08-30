import React, { useEffect, useRef, useState } from 'react';

const WeekdayButton = ({
  customCss,
  children,
  tooltip,
  active,
  value,
  onClick,
}) => {
  const btnRef = useRef();
  const [bgColor, setBgColor] = useState('white-900');

  useEffect(() => {
    setBgColor(active ? 'secondary-900' : 'white-900');
  }, [active]);

  return (
    <button
      ref={btnRef}
      name="week-day-button"
      className={`rounded-full relative w-8 h-8 cursor-pointer button-primary border-2 border-secondary-500/75 bg-${bgColor} text-info font-medium group hover:bg-secondary-500 focus:border-secondary-500 flex justify-center items-center text-xs ${customCss}`}
      onClick={onClick}
      value={value}>
      {children}
      <span className="absolute opacity-0 group-hover:opacity-100 group-hover:text-blue-600 group-hover:text-xs group-hover:-translate-y-6 duration-700">
        {tooltip}
      </span>
    </button>
  );
};

export default WeekdayButton;
