/* eslint-disable import/no-webpack-loader-syntax */

import React, { useEffect, useRef, useState } from 'react';
import {
  anonymizationActions,
  anonymizationState,
} from '../store/anonymization';
import { useDispatch, useSelector } from 'react-redux';

import AnonymizeDataset from './AnonymizeDataset';
import { DATA_LOADING_MESSAGE } from '../utils/Constants';
import DownloadButton from './items/DownloadButton';
import FileUploader from './items/FileUploader';
import Loader from './items/Loader';
import { MdFileDownload } from 'react-icons/md';
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
    actions: ['download sample file', 'input file', 'click next'],
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
    actions: ['set k', 'click audit'],
    submitButtonLabel: 'Audit',
  },
  {
    id: 3,
    name: 'Audit result', //fail or success
    notes: [],
    actions: ['anonymize'],
    submitButtonLabel: 'Anonymize',
  },
];

const datasetDetailsObject = {
  mobilityCSV: null,
  kValue: 20,
  anonymize: false,
};

const AuditDataset = ({ isActive, onClose }) => {
  const slideRef = useRef();
  const dispatch = useDispatch();
  const auditStatus = useSelector(anonymizationState.getAuditStatus);
  const auditData = useSelector(anonymizationState.getAuditData);

  const [step, setStep] = useState(0);
  const [content, setContent] = useState(Steps[0]);
  const [cancelConfirmed, setCancelConfirmed] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [datasetToAudit, setDatasetToAudit] = useState(datasetDetailsObject);
  const [auditResult, setAuditResult] = useState(null);
  const [showAnonymizeDataset, setShowAnonymizeDataset] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(false);

  const handleOnCancel = () => {
    if (cancelConfirmed) {
      setStep(0);
      setLoading(false);
      setError(null);
      onClose();
    } else setCancelConfirmed(false);
    setCancelConfirmed(!cancelConfirmed);
  };

  const handleReset = () => {
    setDatasetToAudit(datasetDetailsObject);
    setStep(0);
    setError(null);
  };

  const handleKValueChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    setDatasetToAudit({ ...datasetToAudit, kValue: newValue });
  };

  const handleOnSubmit = (currentStep) => {
    if (currentStep === 2) {
      const { kValue, mobilityCSV } = datasetToAudit;
      dispatch(
        anonymizationActions.mobilityAuditApiReq({
          data: {
            file: mobilityCSV,
            k: kValue,
          },
        })
      );
      setStep(currentStep);
    } else if (currentStep === 3) {
      if (error) {
        handleReset();
      } else {
        handleOnCancel();
        setShowAnonymizeDataset(true);
      }
    } else setStep(currentStep); //step=1
  };

  const disabledSubmit = (currentStep) => {
    switch (currentStep) {
      case 1:
        return datasetToAudit.mobilityCSV === null;
      case 2:
        return datasetToAudit.kValue <= 0;
      default:
        return;
    }
  };

  useEffect(() => {
    TagManager.dataLayer({
      dataLayer: {
        page: 'auditDataset',
        category: 'PageView',
        value: 1,
      },
      dataLayerName: 'PageDataLayer',
    });
  }, []);

  useEffect(() => {
    setContent(Steps[step]);
  }, [step]);

  useEffect(() => {
    step + 1 === 3 && setLoading(auditStatus.loading);
    if (step + 1 === 3 && auditStatus.error) {
      setError(auditStatus.message);
    }
  }, [auditStatus, step]);

  useEffect(() => {
    if (auditData?.minK) {
      auditData.minK > datasetToAudit.kValue
        ? setAuditResult('success')
        : setAuditResult('fail');
    }
  }, [auditData, datasetToAudit]);

  useEffect(() => {
    let loadingTimeout;

    setLoadingMessage(DATA_LOADING_MESSAGE[0]);

    loadingTimeout = setTimeout(() => {
      if (loading) {
        setLoadingMessage(DATA_LOADING_MESSAGE[1]);
      }
    }, 10000);

    loadingTimeout = setTimeout(() => {
      if (loading) {
        setLoadingMessage(DATA_LOADING_MESSAGE[2]);
      }
    }, 30000);
    loadingTimeout = setTimeout(() => {
      if (loading) {
        setLoadingMessage(DATA_LOADING_MESSAGE[3]);
      }
    }, 60000);

    return () => {
      clearTimeout(loadingTimeout);
      setLoadingMessage(DATA_LOADING_MESSAGE[0]);
    };
  }, [loading]);

  return (
    <>
      {showAnonymizeDataset ? (
        <AnonymizeDataset onClose={() => setShowAnonymizeDataset(false)} />
      ) : (
        <SlideOver
          ref={slideRef}
          title={'Dataset Audit'}
          subtitle={'Upload - Select K - Audit'}
          open={isActive}
          onClose={() => {
            onClose();
          }}
          disableCloseOnBackdropClicked={true}>
          <div id="content" className="mx-4 mt-2">
            <h2 className="font-bold text-xl">
              Step {step + 1} - {content?.name}
            </h2>
            {step + 1 < 3 ? (
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
              </div>
            ) : (
              !loading &&
              auditStatus.ok && (
                <div
                  id="result-status"
                  className={`mt-6 uppercase text-center text-3xl font-extrabold px-4 py-8 ${
                    auditResult === 'success'
                      ? 'bg-success/30 border-l-4 border-success text-success-darker'
                      : auditResult === 'fail'
                        ? 'bg-danger/20 border-l-4 border-danger text-danger/70'
                        : 'bg-slate-200 text-slate-600'
                  }`}>
                  {auditResult ?? 'No Result'}
                </div>
              )
            )}
            <div
              id="content-actions-div"
              className={`mt-4 px-4 py-8 rounded-lg items-center justify-center ${step + 1 < 3 ? 'border border-primary/40 bg-neutral' : auditResult ? 'bg-slate-100 shadow-sm' : 'py-0 px-0 mt-0'}`}>
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
                        setDatasetToAudit({
                          ...datasetToAudit,
                          mobilityCSV: csv,
                        })
                      }
                    />
                  </div>
                </div>
              ) : step + 1 === 2 ? (
                //* Step 2: Choose K value & audit
                <div>
                  <div className="custom-range-slider-div">
                    K={' '}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={datasetToAudit.kValue}
                      className="custom-range-slider"
                      onChange={handleKValueChange}
                    />
                    <p className="custom-range-slidervalue text-xl">
                      {datasetToAudit.kValue}
                    </p>
                  </div>
                </div>
              ) : (
                step + 1 === 3 &&
                (auditStatus.loading ? (
                  <Loader
                    fixed={false}
                    message={loadingMessage}
                    className="my-2"
                  />
                ) : auditStatus.ok ? (
                  auditResult === 'success' ? (
                    <div className="text-text-lightDark leading-8">
                      You selected a K value of {datasetToAudit.kValue}, which
                      is equal to, or below the smallest K value found in your
                      dataset.
                      <span className="block font-bold my-4">
                        In fact, the smallest K-value we found is K ={' '}
                        {auditData.minK ?? ' - '}.
                      </span>
                      If you wish, you may use UtiP-DAM free anonymization tool
                      to set an even higher K, granting even more anonymity to
                      the individuals in your dataset.
                    </div>
                  ) : auditResult === 'fail' ? (
                    <div className="text-text-lightDark leading-8">
                      You selected a K value of {datasetToAudit.kValue}, however
                      we found trajectories below this K value in your dataset.
                      <span className="block font-bold my-4">
                        In fact, the smallest K-value we found is K ={' '}
                        {auditData.minK ?? ' - '}.
                      </span>
                      We recommend that you use UtiP-DAM free anonymization tool
                      by clicking on the Anonymize button below.
                    </div>
                  ) : null
                ) : (
                  error && (
                    <div
                      id="status-message"
                      className="text-error font-semibold">
                      {error.error}
                    </div>
                  )
                ))
              )}
            </div>

            {}

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
                {error ? 'Start over' : content?.submitButtonLabel}
                {loading && <span className="loading loading-spinner"></span>}
              </button>
            </div>
          </div>
        </SlideOver>
      )}
    </>
  );
};

export default AuditDataset;
