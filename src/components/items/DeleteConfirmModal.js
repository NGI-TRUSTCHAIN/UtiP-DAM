import Modal from './Modal';

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  confirmDelete,
  title,
  confirmMessage,
  deleteLabel = 'Yes, delete',
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnClickOutside={true}>
      <div className="p-4">
        <h3 className="text-lg font-bold mb-6">
          {title ?? 'Confirm Deletion'}
        </h3>
        <p className="mb-8">
          {confirmMessage ?? 'Are you sure you want to delete?'}
        </p>
        <div className="flex justify-end gap-2">
          <button className="btn btn-primary btn-sm " onClick={confirmDelete}>
            {deleteLabel}
          </button>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
