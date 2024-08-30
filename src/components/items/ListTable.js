import React, { useState } from 'react';

import { BsThreeDots } from 'react-icons/bs';
import DropdownMenuButton from './DropdownMenuButton';
import Loader from './Loader';
import NoData from './NoData';
import Pagination from './Pagination';

const ListTable = ({
  name = '',
  rowsPerPage = 5,
  headers = [],
  dataArray = [],
  options = [], // [{ text: 'Download dataset', onClick: handleDownloadDataset }, ..]
  componentType = 'table', // or 'list'
  loading,
  noDataMessage = 'No data found.',
  containerClassName = '',
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(dataArray.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const currentPageData = dataArray.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div id={name + '-' + componentType} className="px-2 my-1">
      {dataArray.length > 0 ? (
        componentType === 'list' ? (
          <ul className="menu menu-md rounded-none w-full gap-1">
            {currentPageData.map((item, idx) => (
              <li key={idx}>
                <div
                  className={`full-inline-between font-medium tracking-wide text-secondary-900 ${
                    idx !== currentPageData.length ? 'border-b' : ''
                  }`}>
                  <span id="main-content">
                    <span id="id" className="opacity-60 font">
                      {startIndex + (idx + 1)}.
                    </span>{' '}
                    {item?.name}
                  </span>
                  <div id="extra-contents">
                    {item?.extraContents}
                    {options?.length > 0 && (
                      <DropdownMenuButton
                        buttonIcon={<BsThreeDots />}
                        options={options}
                        item={item}
                        listClassName="min-w-60 text-primary-1400"
                      />
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div
            className={
              'overflow-x-auto w-full bg-slate-100 rounded mt-2 ' +
              containerClassName
            }>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  {headers?.map((header, idx) => (
                    <th key={idx} className="capitalize">
                      {typeof header === 'string' && header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentPageData.map((item, idx) => (
                  <tr key={idx}>
                    <td>{startIndex + (idx + 1)}</td>
                    {Object.keys(item)
                      .filter((i) => i !== 'datum')
                      .map((key, idx) => (
                        <td key={idx}>
                          {(item[key]?.className &&
                            item[key]?.className !== '') ||
                          key === 'status' ? (
                            <span
                              className={
                                key === 'status'
                                  ? `capitalize p-2 shadow-sm tracking-wide badge badge-xs ${item.status === 'inactive' || item.status === 'expired' || item.status === 'failed' ? 'badge-error' : item.status === 'active' ? 'badge-success' : 'badge-outline'} badge-${item.status}`
                                  : item[key].className
                              }>
                              {item[key]}
                            </span>
                          ) : (
                            item[key]
                          )}
                        </td>
                      ))}
                    {options?.length > 0 && (
                      <td>
                        <DropdownMenuButton
                          buttonIcon={<BsThreeDots />}
                          options={options}
                          item={item}
                          listClassName="min-w-60 text-primary-1400"
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : loading ? (
        <Loader fixed={false} message={'loading..'} className="text-sm py-2" />
      ) : (
        <NoData className="text-slate-400 my-8" text={noDataMessage} />
      )}
      <div
        id="footer-pagination"
        className="mt-[-.5rem] mb-2 full-inline-between">
        <span />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <div className="text-xs tracking-wide text-slate-400">
          Total: {dataArray?.length || 0} items
        </div>
      </div>
    </div>
  );
};

export default ListTable;
