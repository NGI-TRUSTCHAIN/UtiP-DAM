import React, { useEffect, useState } from 'react';

import DatePicker from './DatePicker';
import MessageWithTimeout from './MessageWithTimeout';

const DownloadDatePickerDialog = ({
  dataset,
  loading,
  onDownload,
  onSelectedDates,
}) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [showDownloadLimit, setShowDownloadLimit] = useState(false);

  useEffect(() => {
    setShowDownloadLimit(selectedDates.length > 7);
    onSelectedDates(selectedDates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDates]);

  return (
    <dialog id="date-picker-modal" className="modal h-full">
      <div className="modal-box h-full modal-top min-w-1/2 max-w-3xl">
        <h3 className="font-bold text-lg text-start">
          Download - {dataset?.name}
        </h3>
        <p className="pt-4 text-start">
          Select the dates you would like to download
        </p>
        <div className="text-start mt-3 mb-5 p-3 text-sm border-l-4 border-l-info/70 shadow-md bg-info/30 hover:shadow-primary/30">
          <h4 className="font-bold mb-4">Notes</h4>
          <ul className="list list-disc list-outside pl-4 leading-relaxed text-justify">
            <li>
              The more dates you select, the heavier the file will be, which can
              cause trouble if your internet connection is not stable.
            </li>
            <li>
              We zip the files before download to reduce the overall size of the
              download.
            </li>
          </ul>
        </div>
        <DatePicker
          id="download-dataset-date-picker"
          mode="multiple"
          dates={dataset?.dates}
          readonly={selectedDates?.length === dataset?.dates?.length}
          inline={true}
          selectByDefault={true}
          onChange={(dates) => {
            if (dates.length > 7) setShowDownloadLimit(true);
            else setShowDownloadLimit(false);
            setSelectedDates(dates);
          }}
        />
        <div id="select-all-dates" className="full-inline-between my-4 text-xs">
          <span className="inline-flex">
            <input
              type="checkbox"
              className="checkbox checkbox-xs mr-2 border-2 checked:checkbox-primary items-baseline"
              disabled={dataset?.dates?.length > 7}
              checked={selectedDates?.length === dataset?.dates?.length}
              onChange={() => {
                setSelectedDates(
                  selectedDates?.length === dataset.dates.length
                    ? []
                    : dataset.dates
                );
              }}
            />
            Select all available dates
          </span>
          <span className="px-4">[Max download limit: 7 days]</span>
        </div>
        <div className="modal-action mt-0">
          {showDownloadLimit && (
            <MessageWithTimeout
              timeout={false}
              message={
                'You can only download data for a maximum of 7 days at a time.'
              }
              className={'py-1 text-xs text-error font-semibold'}
            />
          )}
          <form method="dialog">
            <button
              id="download-dataset-close"
              type="cancel"
              className="btn btn-sm text-danger/90 btn-outline mx-1"
              onClick={() => setShowDownloadLimit(false)}>
              Close
            </button>
          </form>
          <button
            className="btn btn-sm btn-primary"
            disabled={
              selectedDates.length === 0 || showDownloadLimit || loading
            }
            onClick={onDownload}>
            {loading ? (
              <>
                <span className="loading loading-spinner" />
                Downloading dataset
              </>
            ) : (
              'Download'
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DownloadDatePickerDialog;
