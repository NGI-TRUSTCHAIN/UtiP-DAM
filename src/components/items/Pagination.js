import React from 'react';

const btnClassName = 'border border-slate-300 text-slate-500 ';
const disabledClassName = 'btn-disabled opacity-30 ';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const disableIslandButton = () => {
    return (
      currentPage === 1 ||
      currentPage === 2 ||
      currentPage === totalPages - 1 ||
      currentPage === totalPages
    );
  };

  return (
    <div className="flex justify-center mt-2">
      <div className="join">
        {totalPages > 9 ? (
          <>
            <button
              className={`join-item btn btn-xs ${currentPage === 1 ? disabledClassName : btnClassName}`}
              onClick={() => handlePageChange(currentPage - 1)}>
              «
            </button>
            <button
              className={`join-item btn btn-xs ${currentPage === 1 ? 'btn-active' : btnClassName}`}
              onClick={() => handlePageChange(1)}>
              1
            </button>
            <button
              className={`join-item btn btn-xs ${currentPage === 2 ? 'btn-active' : btnClassName}`}
              onClick={() => handlePageChange(2)}>
              2
            </button>
            <button
              className={`join-item btn btn-xs ${disableIslandButton() ? disabledClassName : btnClassName + 'btn-active'}`}>
              {disableIslandButton() ? '...' : currentPage}
            </button>
            <button
              className={`join-item btn btn-xs ${currentPage === totalPages - 1 ? 'btn-active' : btnClassName}`}
              onClick={() => handlePageChange(totalPages - 1)}>
              {totalPages - 1}
            </button>
            <button
              className={`join-item btn btn-xs ${currentPage === totalPages ? 'btn-active' : btnClassName}`}
              onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </button>
            <button
              className={`join-item btn btn-xs ${currentPage === totalPages ? disabledClassName : btnClassName}`}
              onClick={() => handlePageChange(currentPage + 1)}>
              »
            </button>
          </>
        ) : (
          Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <input
                key={page}
                className={`join-item btn btn-xs ${
                  page === currentPage
                    ? 'btn-active'
                    : 'border border-slate-300 text-slate-500'
                }`}
                type="radio"
                name="options"
                aria-label={page}
                onClick={() => handlePageChange(page)}
              />
            )
          )
        )}
      </div>
    </div>
  );
};

export default Pagination;
