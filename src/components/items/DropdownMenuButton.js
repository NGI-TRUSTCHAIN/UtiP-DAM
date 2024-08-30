import { BsThreeDots } from 'react-icons/bs';
import { useState } from 'react';

const DropdownMenuButton = ({
  buttonIcon,
  options,
  item,
  listClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (onClickFunction) => {
    onClickFunction(item);
    setIsOpen(false);
  };

  return (
    <div className="dropdown dropdown-left">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-circle btn-xs btn-ghost"
        onClick={() => setIsOpen(!isOpen)}>
        {buttonIcon ?? <BsThreeDots />}
      </div>
      {isOpen && (
        <ul
          tabIndex={0}
          className={
            'dropdown-content z-[1] menu px-2 shadow bg-base-100 rounded min-w-max ' +
            listClassName
          }>
          {options.map((option, index) => (
            <li key={index} className="flex w-full">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => handleItemClick(option.onClick)}>
                {option.text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenuButton;
