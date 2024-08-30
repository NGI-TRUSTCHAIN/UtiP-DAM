import React, { useEffect, useState } from 'react';
import {
  authenticationActions,
  authenticationState,
} from '../store/authentication';
import { useDispatch, useSelector } from 'react-redux';

import CopyText from './items/CopyText';
import DatePicker from './items/DatePicker';
import { DateTime } from 'luxon';
import { SlideOver } from './items/SlideOver';
import { durationInMonth } from '../utils/Helper';

const fieldClassName =
  'input input-md bg-slate-200 shadow-sm text-primary-1400 font-medium w-full ';
const labelClassName = 'label font-medium';

const PurchasedDatasetDetails = ({ dataset, isActive, onClose }) => {
  const dispatch = useDispatch();

  const downloadStatus = useSelector(authenticationState.premiumDownloadStatus);

  const [allPastDataChecked, setAllPastDataChecked] = useState(false);
  const [enableDownload, setEnableDownload] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [isInactive, setIsInactive] = useState(false);

  const handleDatePickerChange = (dates) => {
    let tmpIsoDates = [];
    dates?.forEach((date) => {
      const jsDate = new Date(date);
      const isoDate = DateTime.fromJSDate(jsDate).toFormat('yyyy-MM-dd');
      tmpIsoDates.push(isoDate);
    });
    setSelectedDates(tmpIsoDates);
  };

  useEffect(() => {
    let flag =
      (selectedDates.length > 0 || allPastDataChecked) &&
      !dataset?.status?.toLowerCase().includes('inactive');
    setEnableDownload(flag);
    setIsInactive(dataset?.status?.toLowerCase().includes('inactive'));
  }, [selectedDates, allPastDataChecked, dataset]);

  const handleDownload = () => {
    let selectedDatasetIds = [];
    if (selectedDates.length > 0) {
      selectedDatasetIds = selectedDates
        .map((i) => dataset.dates.indexOf(i))
        .map((j) => dataset.datasetIds[j]);
    } else if (allPastDataChecked) {
      selectedDatasetIds = dataset.datasetIds;
    }
    const fileName =
      selectedDates.length > 1
        ? dataset?.datasetName +
          '_' +
          selectedDates[0] +
          '_' +
          selectedDates[selectedDates.length - 1]
        : dataset?.datasetName + '_' + selectedDates[0] ?? undefined;

    dispatch(
      authenticationActions.downloadPremiumApiReq({
        apiKey: dataset.apiKey,
        params: { datasetIds: selectedDatasetIds.toString() },
        filename: fileName,
      })
    );
  };

  return (
    <SlideOver
      id="purchase-details"
      title={'My Purchases > ' + dataset?.datasetName}
      open={isActive}
      onClose={onClose}>
      <div className="form-control w-full gap-3">
        <div className="full-inline-between gap-4">
          <span id="status" className="w-1/3">
            <label htmlFor="status" className={labelClassName}>
              <span className="label-text">License Status</span>
            </label>
            <input
              type="text"
              name="status"
              className={
                fieldClassName + `${isInactive ? 'text-red-600 ' : ''}`
              }
              value={dataset.status}
              readOnly={true}
            />
          </span>
          <span id="end-date" className="w-2/3">
            <label htmlFor="end-date" className={labelClassName}>
              <span className="label-text">License End Date</span>
            </label>
            <input
              type="text"
              name="end-date"
              className={fieldClassName}
              value={dataset.licenseEndDate}
              readOnly={true}
            />
          </span>
        </div>
        <div className="full-inline-between gap-4">
          <span id="status" className="w-1/3">
            <label htmlFor="status" className={labelClassName}>
              <span className="label-text">License Details</span>
            </label>
            <input
              type="text"
              name="status"
              className={fieldClassName + 'capitalize'}
              value={dataset.pastDate ? 'Past Data: YES' : 'Past Data: NO'}
              readOnly={true}
            />
          </span>
          <span id="end-date" className="w-2/3 mt-9">
            <input
              type="text"
              name="end-date"
              className={fieldClassName}
              value={`Future Data: ${dataset.futureDate ? 'YES' : 'NO'} ${
                dataset.futureDate
                  ? ' - ' +
                    durationInMonth(
                      dataset.licenseStartDate,
                      dataset.licenseEndDate
                    ) +
                    ' Months License'
                  : ''
              }`}
              readOnly={true}
            />
          </span>
        </div>
        <div className="full-inline-between gap-4">
          <span id="company" className="w-1/3">
            <label htmlFor="company" className={labelClassName}>
              <span className="label-text">Dataset Owner</span>
            </label>
            <input
              type="text"
              name="company"
              className={fieldClassName + 'capitalize'}
              value={dataset?.datasetOwner}
              readOnly={true}
            />
          </span>
          <span id="email" className="w-2/3 mt-9">
            <input
              type="text"
              name="email"
              className={fieldClassName}
              value={dataset?.datasetOwnerEmail}
              readOnly={true}
            />
          </span>
        </div>
        <div id="download-data">
          <label htmlFor="download-data" className={labelClassName}>
            <span className="label-text">
              Download Data
              {isInactive ? (
                <span className="text-xs text-error px-2 capitalize">
                  (Download unavailable due to inactive license)
                </span>
              ) : undefined}
            </span>
          </label>
          <div className="full-inline-between items-end px-8 gap-4">
            <div className="w-2/3">
              <DatePicker
                id="download-purchased-dataset-date-picker"
                mode="multiple"
                dates={dataset?.dates || []}
                // readonly={!enableDownload}
                readonly={allPastDataChecked || isInactive}
                inline={true}
                selectByDefault={true}
                onChange={handleDatePickerChange}
              />
            </div>
            <span className="flex flex-col items-baseline gap-8">
              <span className="flex items-center">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={allPastDataChecked}
                  disabled={isInactive}
                  onChange={() => {
                    setAllPastDataChecked(!allPastDataChecked);
                  }}
                />
                <label className="ml-1 text-sm ">Select all past data</label>
              </span>
              <button
                className="btn btn-wide btn-primary"
                onClick={handleDownload}
                disabled={!enableDownload || downloadStatus.loading}>
                {downloadStatus.loading ? 'Downloading..' : 'Download as ZIP'}
              </button>
            </span>
          </div>
          <div className="mt-4">
            <label htmlFor="download-data" className={labelClassName}>
              <span className="label-text">Receive Future Data via API</span>
            </label>
            <label
              className={'input flex items-center w-full gap-2 bg-slate-200'}>
              GET
              <input
                type="text"
                className={fieldClassName}
                value={dataset?.apiKey}
                readOnly={true}
              />
              <CopyText textToCopy={dataset?.apiKey} />
            </label>
          </div>
        </div>
        <div className="flex w-full justify-end mt-4 border-t py-4">
          <button className="btn btn-outline btn-sm w-30" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </SlideOver>
  );
};

export default PurchasedDatasetDetails;
