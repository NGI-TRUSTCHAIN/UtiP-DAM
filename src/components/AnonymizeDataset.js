/* eslint-disable import/no-webpack-loader-syntax */

import React, { useEffect, useRef, useState } from 'react';
import {
  anonymizationActions,
  anonymizationState,
} from '../store/anonymization';
import { useDispatch, useSelector } from 'react-redux';

import DownloadButton from './items/DownloadButton';
import FileUploader from './items/FileUploader';
import { MdFileDownload } from 'react-icons/md';
import NoData from './items/NoData';
import ShareDataset from './ShareDataset';
import { SlideOver } from './items/SlideOver';
import TagManager from 'react-gtm-module';
import sampleCSV from '!!raw-loader!../assets/docs/sample_dataset.csv';

const Steps = [
  {
    id: 1,
    name: 'Upload your dataset in the field below',
    notes: [
      'Accepted format: csv',
      'Make sure that the file has a column dedicated to GPS coordinates. If you collect mobility data via sensors or ticketing systems, input the coordinate of the sensors or of the ticketing booth/turnkey system.',
    ],
    actions: ['download sample file', 'input file', 'click next'], //just for the note flow
    submitButtonLabel: 'Next',
  },
  {
    id: 2,
    name: 'Select K',
    notes: [
      'UtiP-DAM uses K-anonymization techniques to anonymize datasets',
      'K is the number of people that will be used to build mobility clusters. The greater the K, the more anonymity is granted to individuals in the dataset.',
      'We recommend K = 20 for non-sensitive, large areas. For smaller areas, or datasets that included sensitive locations (e.g: religious places, hospitals, etc.), K should be higher (e.g: K= 50)',
    ],
    actions: ['set k', 'click anonymize'],
    submitButtonLabel: 'Anonymize',
  },
  {
    id: 3,
    name: 'Download anonymized dataset',
    notes: [
      'Important: Read the text below before downloading the dataset.',
      "While UtiP-DAM uses a state-of-the-art anonymization algorithm, due to the intrinsic nature of mobility data, a risk remains that an individual's identity could be exposed.",
      'By clicking on the checkbox below, you acknowledge that the use of the anonmyzed dataset generated by this tool is under your own responsibility. ',
      'Neither Correlation Systems nor NGI Trustchain will be held, under any circumstances, liable for any damage resulting from the use of the anonymized dataset (including: distribution, secondary use, etc.).',
    ],
    actions: ['download', 'put dataset online', 'anonymize another dataset'],
    submitButtonLabel: 'Anonymize another dataset',
  },
];

const datasetDetailsObject = {
  mobilityCSV: null,
  kValue: 20,
  consentChecked: false,
  share: false,
  anonymizeAnother: false,
};

const AnonymizeDataset = ({ isActive, onClose }) => {
  const slideRef = useRef();
  const dispatch = useDispatch();
  const mobilityUploadStatus = useSelector(
    anonymizationState.getMobilityUploadStatus
  );
  const mobilityDatasetPostStatus = useSelector(
    anonymizationState.getMobilityUploadStatus
  );
  const performanceMetricsData = useSelector(
    anonymizationState.getMobilityUploadPerformanceMetricsData
  );
  const uploadedDatasetInCsv = useSelector(
    anonymizationState.selectDownloadedCsv
  );
  const [step, setStep] = useState(0);
  const [content, setContent] = useState(Steps[0]);
  const [cancelConfirmed, setCancelConfirmed] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shareDataset, setShareDataset] = useState(false);
  const [datasetToAnonymize, setDatasetToAnonymize] =
    useState(datasetDetailsObject);

  const [readyToShare, setReadyToShare] = useState(false);

  const handleDownload = (file, fileName) => {
    if (!!file) {
      const blob = new Blob([file], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setReadyToShare(true);
    }
  };

  const handleOnCancel = () => {
    if (cancelConfirmed) {
      setStep(0);
      setLoading(false);
      setError(null);
      onClose();
    } else setCancelConfirmed(false);
    setCancelConfirmed(!cancelConfirmed);
  };

  const handleKValueChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    setDatasetToAnonymize({ ...datasetToAnonymize, kValue: newValue });
  };
  const anonymizeDataset = () => {
    const { kValue, mobilityCSV } = datasetToAnonymize;

    dispatch(
      anonymizationActions.mobilityAnonymizationApiReq({
        data: {
          file: mobilityCSV,
          k: kValue,
        },
        method: 'post',
      })
    );
  };

  const handleOnSubmit = (currentStep) => {
    setError(null);
    if (currentStep >= 3) {
      setDatasetToAnonymize(datasetDetailsObject);
      setReadyToShare(false);
      setStep(0);
      setError(null);
    } else if (currentStep === 2) {
      dispatch(
        anonymizationActions.initializeState({ key: 'mobility_upload' })
      );
      setStep(currentStep);
    } else {
      setStep(currentStep);
    }
  };

  const disabledSubmit = (currentStep) => {
    switch (currentStep) {
      case 1:
        return datasetToAnonymize.mobilityCSV === null;
      case 2:
        return datasetToAnonymize.kValue <= 0;
      case 3:
        return !datasetToAnonymize.consentChecked;
      default:
        return;
    }
  };

  useEffect(() => {
    TagManager.dataLayer({
      dataLayer: {
        page: 'anonymizeDataset',
        category: 'PageView',
        value: 1,
      },
      dataLayerName: 'PageDataLayer',
    });
    dispatch(anonymizationActions.initializeState({ key: 'mobility_upload' }));
  }, []);

  useEffect(() => {
    setContent(Steps[step]);
  }, [step]);

  useEffect(() => {
    step + 1 === 3 && setLoading(mobilityUploadStatus.loading);
    if (step + 1 === 3 && mobilityUploadStatus.error) {
      setError(mobilityUploadStatus.message);
    } else setError(null);
  }, [mobilityUploadStatus, step]);

  useEffect(() => {
    setLoading(mobilityDatasetPostStatus.loading);

    if (mobilityDatasetPostStatus.error) {
      setError(mobilityDatasetPostStatus.message);
    } else if (mobilityDatasetPostStatus.ok && !!uploadedDatasetInCsv) {
      handleDownload(uploadedDatasetInCsv, 'anonymized_dataset.csv');
    }
  }, [uploadedDatasetInCsv, mobilityDatasetPostStatus]);

  return (
    <>
      {shareDataset ? (
        <ShareDataset
          datasetFile={datasetToAnonymize.mobilityCSV}
          kValue={datasetToAnonymize.kValue}
          onClose={() => {
            setShareDataset(false);
          }}
        />
      ) : (
        <SlideOver
          id="anonymize-dataset"
          ref={slideRef}
          title={'Dataset Anonymization'}
          subtitle={'Upload - Select K - Anonymize - Download/Share'}
          open={isActive}
          onClose={() => {
            onClose();
          }}
          disableCloseOnBackdropClicked={true}>
          <div id="content" className="mx-4 mt-2">
            <h2 className="font-bold text-xl">
              Step {step + 1} - {content?.name}
            </h2>
            {!readyToShare && (
              <div
                id="notes-desc"
                className="mt-3 mb-5 p-3 text-sm border-l-4 border-l-accent/70 shadow-md bg-accent/30 hover:shadow-primary/30">
                <h4 className="font-bold mb-4">Notes</h4>
                {content?.notes.map((note, i) => (
                  <ul
                    key={i}
                    className="list list-disc list-outside pl-4 leading-relaxed">
                    <li>{note}</li>
                  </ul>
                ))}
                {step + 1 === 3 && (
                  <div
                    id="consent"
                    className="inline-flex items-center mt-4 text-xs font-semibold">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-error checkbox-sm mr-3 border-2 checked:checkbox-primary"
                      checked={datasetToAnonymize.consentChecked}
                      onChange={() =>
                        setDatasetToAnonymize({
                          ...datasetToAnonymize,
                          consentChecked: !datasetToAnonymize.consentChecked,
                        })
                      }
                    />
                    I have read and understood the text above, and consent not
                    to held Correlation Systems nor NGI Trustchain reliable for
                    any damage resulting from the use of the dataset anonymized
                    via this tool.
                  </div>
                )}
              </div>
            )}
            <div
              id="content-actions-div"
              className={`px-4 py-8 rounded-lg border border-primary/40 bg-neutral items-center justify-center ${readyToShare ? 'mt-8' : ''}`}>
              {step + 1 === 1 ? (
                //* Step 1:  Upload Mobility CSV
                <div className="grid grid-cols-3 gap-2 items-center justify-center">
                  <DownloadButton
                    className="btn btn-sm btn-ghost bg-sky-200 text-text-lightDark shadow-sm hover:bg-sky-300 hover:ring-sky-50 h-full m-2 flex justify-center items-center text-md"
                    type={'text/csv'}
                    file={sampleCSV}
                    fileName="sample_dataset.csv">
                    <MdFileDownload className="text-lg hover:animate-raise" />
                    Download Sample File
                  </DownloadButton>
                  <div className="col-span-2 border-l-2 border-l-primary/20 py-2 ">
                    <FileUploader
                      onFileUploaded={(csv) =>
                        setDatasetToAnonymize({
                          ...datasetToAnonymize,
                          mobilityCSV: csv,
                        })
                      }
                    />
                  </div>
                </div>
              ) : step + 1 === 2 ? (
                //* Step 2: Choose K value & Anonymize
                <div>
                  <div className="custom-range-slider-div">
                    K={' '}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={datasetToAnonymize.kValue}
                      className="custom-range-slider"
                      onChange={handleKValueChange}
                    />
                    <p className="custom-range-slidervalue text-xl">
                      {datasetToAnonymize.kValue}
                    </p>
                  </div>
                </div>
              ) : //* Step 3: Consent and Download Anonymized Dataset
              !readyToShare ? (
                <span
                  id="download-dataset"
                  className="w-full inline-flex justify-center items-center">
                  <span
                    className={
                      !datasetToAnonymize.consentChecked ? 'tooltip' : ''
                    }
                    data-tip="Please agree to the terms by checking the box to proceed.">
                    <button
                      className={`btn btn-link text-text-lightDark text-lg ${loading ? 'no-underline' : ''}`}
                      onClick={() => anonymizeDataset()}
                      disabled={disabledSubmit(step + 1) || loading}>
                      <MdFileDownload className="text-lg hover:animate-raise" />{' '}
                      {loading ? 'Downloading..' : 'Download dataset'}{' '}
                      {loading && (
                        <span className="loading loading-spinner"></span>
                      )}
                    </button>
                  </span>
                </span>
              ) : (
                <div id="performance-metrics">
                  <h3 className="text-xl font-semibold mb-2">
                    Performance Metrics
                  </h3>
                  {performanceMetricsData?.length > 0 ? (
                    <ul className="list list-disc ml-8 leading-8">
                      {Object.entries(performanceMetricsData[0]).map(
                        ([key, value]) => {
                          return (
                            <li key={key}>
                              {key}: {value}
                            </li>
                          );
                        }
                      )}
                    </ul>
                  ) : (
                    <NoData
                      text={'Not available'}
                      className="opacity-50 m-0 mx-2 "
                    />
                  )}
                </div>
              )}
            </div>
            {step + 1 === 3 && (
              //* Optional Step: Shared Dataset to make it Public
              <button
                className="btn btn-link text-primary text-sm underline underline-offset-2 text-end hover:text-primary-dark disabled:bg-transparent"
                onClick={() => {
                  setShareDataset(true);
                }}
                disabled={
                  disabledSubmit(step + 1) ||
                  mobilityDatasetPostStatus.loading ||
                  mobilityDatasetPostStatus.error ||
                  !readyToShare
                }>
                Make this dataset available on Utip-DAM marketplace
              </button>
            )}
            {error && (
              <div
                id="status-message"
                className="text-error font-semibold mt-2">
                {(step >= 2 && error.error) ??
                  'Error occurred, please try again.'}
              </div>
            )}

            <div
              id="action-buttons"
              className="w-full inline-flex justify-end gap-4 mt-4">
              {step + 1 < Steps.length ? (
                <button
                  className="btn btn-sm btn-error btn-outline"
                  onClick={handleOnCancel}>
                  {cancelConfirmed
                    ? 'Click again to cancel the process'
                    : 'Cancel'}
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-error btn-outline"
                  onClick={() => onClose()}>
                  Close
                </button>
              )}
              <button
                className="btn btn-sm btn-primary"
                disabled={disabledSubmit(step + 1) || loading}
                onClick={() => handleOnSubmit(step + 1)}>
                {content?.submitButtonLabel}
              </button>
            </div>
          </div>
        </SlideOver>
      )}
    </>
  );
};

export default AnonymizeDataset;
