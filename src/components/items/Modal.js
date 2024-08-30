import React, { useState } from 'react';

const Modal = ({ id, isOpen, onClose, closeOnClickOutside, children }) => {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);

  const handleClose = () => {
    setIsModalOpen(false);
    onClose();
  };

  const handleModalClick = (e) => {
    if (closeOnClickOutside && e.target.classList.contains('modal')) {
      handleClose();
    }
  };
  React.useEffect(() => {
    if (isModalOpen) document.getElementById(id ?? 'modal').showModal();
  }, [isModalOpen, id]);

  return (
    <>
      {isModalOpen && (
        <dialog id={id ?? 'modal'} className="modal" onClick={handleModalClick}>
          <div className="modal-box relative w-auto mx-auto max-w-3xl">
            <form method="dialog">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-lg"
                onClick={handleClose}>
                &times;
              </button>
            </form>
            <div className="modal-body">{children}</div>
          </div>
        </dialog>
      )}
    </>
  );
};

export default Modal;
