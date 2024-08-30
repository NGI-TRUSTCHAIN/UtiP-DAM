/* eslint-disable import/no-webpack-loader-syntax */

import React, { useEffect, useRef, useState } from 'react';
import {
  anonymizationActions,
  anonymizationState,
} from '../store/anonymization';
import { datasetActions, datasetState } from '../store/dataset';
import { extractLatLong, formattedNumber } from '../utils/Helper';
import { useDispatch, useSelector } from 'react-redux';

import DatePicker from './items/DatePicker';
import { DateTime } from 'luxon';
import Loader from './items/Loader';
import LocationsMap from './LocationsMap';
import { MdClose } from 'react-icons/md';
import { RISK_LEVEL } from '../utils/Constants';
import { SlideOver } from './items/SlideOver';
import TagManager from 'react-gtm-module';
import { TbPencilCheck } from 'react-icons/tb';
import { isEmpty } from 'lodash';

const Steps = [
  {
    name: 'Select a day during which your data may have been captured',
    notes: [
      <span>
        Not sure how Find me Here works? Read our explanations{' '}
        <a
          href="/about_find_me_here"
          target="_blank"
          className="link-neutral underline underline-offset-2 hover:text-amber-700">
          here
        </a>
        .
      </span>,
      'Make sure to select a day where your data was likely captured, for example, because you visited that place on that day.',
      'Only days with green outline can be selected for analysis.',
    ],
    actions: ['Choose days', 'click next'],
    submitButtonLabel: 'Next',
  },
  {
    name: 'Select on the map all the locations, in order, that best match your journey that day',
    notes: [
      'We have pre-populated the map with the location of sensors or with GPS coordinates that have been used to compile the dataset. This means that you do not need to add more information than what is already available in the dataset.',
    ],
    actions: ['mark the location', 'click get result'],
    submitButtonLabel: 'Get Results',
  },
  {
    name: 'Result',
    notes: [],
    actions: ['check another journey'],
    submitButtonLabel: 'Check another journey',
  },
];

const FindMeHere = ({ dataset, onClose }) => {
  const slideRef = useRef();
  const dispatch = useDispatch();

  const locationsStatus = useSelector(datasetState.getLocationsGetStatus);
  const locationsData = useSelector(datasetState.getLocationsGetData);
  const riskData = useSelector(anonymizationState.getVisitorDetectionData);
  const riskStatus = useSelector(anonymizationState.getVisitorDetectionStatus);

  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(0);
  const [content, setContent] = useState(Steps[0]);
  const [result, setResult] = useState(null);
  const [cancelConfirmed, setCancelConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedLocation, setSelectedLocation] = useState(undefined);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [selectedDataset, setSelectedDataset] = useState(undefined);
  const [error, setError] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);

  const handleDatePickerChange = (dates) => {
    const date = new Date(dates);
    const isoDate = DateTime.fromJSDate(date).toFormat('yyyy-MM-dd');
    setSelectedDate(isoDate);
    const selectedDatasetIdx = dataset?.dates.findIndex((i) => i === isoDate);
    setSelectedDataset(dataset?.datasets[selectedDatasetIdx]);
  };

  const handleOnCancel = () => {
    if (cancelConfirmed) {
      onCloseSlide();
    } else setCancelConfirmed(false);
    setCancelConfirmed(!cancelConfirmed);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const renderDetectionResult = (result) => {
    if (!result) return null;
    switch (result?.riskLevel?.id) {
      case 0:
        return (
          <div id="no-match" className={''}>
            <div
              className={`text-center text-4xl font-bold capitalize mb-5 text-${RISK_LEVEL[result?.riskLevel?.id].color}`}>
              {result?.riskLevel?.name || 'No Result'}
            </div>
            Your journey could not be found in the {dataset.name} dataset. It
            does not match the journey of any other individuals.
          </div>
        );
      case 1:
        return (
          <div id="no-risk" className="text-justify">
            <div
              className={`text-center text-4xl font-bold capitalize mb-5 text-${
                RISK_LEVEL[result?.riskLevel?.id].color
              }`}>
              {result?.riskLevel?.name || 'No Result'}
            </div>
            Your journey has been found in the {dataset.name} dataset. It
            appears to match the journey of{' '}
            {formattedNumber(result?.count) || '-'} other people.
            <br />
            <br />
            <span className="font-semibold ">
              However, based on our assessment, there seems to be no apparent
              risk of identity exposure.
            </span>
          </div>
        );
      case 2:
        return (
          <div id="low-risk">
            <div
              className={`text-center text-4xl font-bold capitalize mb-5 text-${
                RISK_LEVEL[result?.riskLevel?.id].color
              }`}>
              {result?.riskLevel?.name || 'No Result'}
            </div>
            Your journey has been found in the {dataset.name} dataset. However,
            it also matches the journey of{' '}
            {formattedNumber(result?.count) || '-'} other people,{' '}
            <span className="font-semibold">
              so there is a very small risk that your identity could be exposed.
            </span>
            <br />
            <br />
            Despite a low re-identification risk, we suggest that you reach out
            to the dataset owners to request removal of your personal journey
            from their dataset, to fully assert your right to privacy.
          </div>
        );
      case 3:
        return (
          <div id="high-risk">
            <div
              className={`text-center text-4xl font-bold capitalize mb-5 text-${
                RISK_LEVEL[result?.riskLevel?.id].color
              }`}>
              {result?.riskLevel?.name || 'No Result'}
            </div>
            Your journey has been found in the {dataset.name} dataset. However,
            it also matches the journey of{' '}
            {formattedNumber(result?.count) || '-'} other people. This poses a
            significant risk to your privacy.
            <br />
            <br />
            <span className="font-semibold">
              We strongly advise you to contact the dataset owners immediately
              to request removal of your personal journey from their dataset to
              protect your privacy.
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  const getRiskLevelBorderColor = (riskLevelId) => {
    switch (riskLevelId) {
      case 1:
        return 'border-success';
      case 2:
        return 'border-warning';
      case 3:
        return 'border-danger';
      default:
        return 'border-primary/40';
    }
  };

  const onCloseSlide = () => {
    onClose();
    setOpen(false);
  };

  useEffect(() => {
    TagManager.dataLayer({
      dataLayer: {
        page: 'findMeHere',
        category: 'PageView',
        value: 1,
      },
      dataLayerName: 'PageDataLayer',
    });
  }, []);

  useEffect(() => {
    if (locationsStatus.error || riskStatus.error) {
      setError(
        locationsStatus.error ? locationsStatus.message : riskStatus.message
      );
      setResult(null);
      setSelectedDataset(undefined);
    }
    setLoading(locationsStatus.loading || riskStatus.loading);
  }, [locationsStatus, riskStatus]);

  useEffect(() => {
    let submitBtnFlag = false;

    if (!loading) {
      submitBtnFlag =
        step + 1 === 1
          ? !isEmpty(selectedDate)
          : step + 1 === 3
            ? true
            : !isEmpty(selectedLocation);

      if (step + 1 === 3 && !isEmpty(selectedDataset) && isEmpty(result)) {
        dispatch(
          anonymizationActions.visitorDetectionApiReq({
            params: {
              datasetId: selectedDataset.id,
              locationIds: selectedLocation.map((i) => i.id).join(),
            },
          })
        );
      }
      setDisableSubmit(!submitBtnFlag);
    } else {
      setDisableSubmit(true);
    }
  }, [
    step,
    loading,
    selectedDate,
    selectedLocation,
    dataset.datasetDefinitionId,
    result,
    selectedDataset,
    dispatch,
  ]);

  useEffect(() => {
    if (!!dataset?.datasetDefinitionId) {
      dispatch(
        datasetActions.getDatasetLocationsApiReq({
          params: { datasetDefinitionId: dataset.datasetDefinitionId },
        })
      );
    }
  }, [dataset, dispatch]);

  useEffect(() => {
    if (locationsData.length > 0) {
      setLocations(
        locationsData.map((location) => {
          const { lat, lng } = extractLatLong(location.coordinates);
          return { id: location.id, lat: lat, lng: lng, name: location.name };
        })
      );
    } else setLocations([]);
  }, [locationsData]);

  useEffect(() => {
    if (riskData) {
      setError(false);
      setResult(riskData);
    }
  }, [riskData]);

  useEffect(() => {
    setContent(Steps[step]);
    if (step === 0) setResult(null);
  }, [step]);

  return (
    dataset && (
      <SlideOver
        ref={slideRef}
        title={dataset.name}
        open={open}
        onClose={onCloseSlide}>
        {!showSurvey ? (
          <div className="mx-4">
            <h2 className="font-bold text-xl">
              Step {step + 1} - {content.name}
            </h2>
            {content.notes.length > 0 && (
              <div className="mt-3 p-3 border-l-4 border-l-accent/70 shadow-md bg-accent/30 hover:shadow-primary/30">
                <h4 className="font-bold mb-4">Notes</h4>
                {content.notes.map((note, i) => (
                  <ul
                    key={i}
                    className="list-disc list-outside pl-4 leading-relaxed">
                    <li>{note}</li>
                  </ul>
                ))}
              </div>
            )}
            <div
              className={`mt-5 rounded-lg ${step + 1 === 1 ? 'mt-0 p-0' : ''} ${
                step + 1 === 3
                  ? result?.riskLevel?.id === 2
                    ? 'bg-accent/30 border border-accent border-l-4 border-l-accent-dark px-4 py-8'
                    : result?.riskLevel?.id === 1
                      ? 'bg-success/30 border border-success border-l-4 border-l-success-dark px-4 py-8'
                      : result?.riskLevel?.id === 3
                        ? 'bg-danger/30 border border-danger border-l-4 border-l-danger-dark px-4 py-8'
                        : result?.riskLevel?.id === 0
                          ? 'bg-info/30 border border-info border-l-4 border-l-info-dark px-4 py-8'
                          : ''
                  : ''
              } items-center justify-center`}>
              {loading ? (
                <Loader
                  id="loader"
                  fixed={false}
                  message={'Loading..'}
                  className="py-2 rounded"
                />
              ) : (
                <>
                  {step + 1 === 1 && (
                    <div className="grid grid-cols-2 gap-2 items-center justify-center">
                      <DatePicker
                        id="month1"
                        mode="single"
                        dates={dataset.dates}
                        selectByDefault={true}
                        onChange={handleDatePickerChange}
                        className={'col-span-2'}
                      />
                    </div>
                  )}
                  {step + 1 === 2 && (
                    <div className="h-fit relative m-0 p-0 rounded">
                      <LocationsMap
                        coordinates={locations}
                        onLocationSelect={handleLocationSelect}
                      />
                    </div>
                  )}
                  {step + 1 === 3 && (
                    <div id="detection-result" className="text-pretty">
                      {!loading && renderDetectionResult(result)}
                      {error && (
                        <span className="text-danger">
                          {JSON.stringify(error)}
                        </span>
                      )}
                      <br />
                      <div
                        id="details"
                        className={`full-inline-between items-start pt-4 text-sm ${result?.riskLevel ? 'border-t' : 'mt-2 bg-slate-200 rounded-md px-2 pb-3'} ${getRiskLevelBorderColor(
                          result?.riskLevel?.id
                        )}`}>
                        <div id="journey-details" className="w-2/3">
                          <span className="font-semibold mb-2">
                            Your journey on {selectedDate}:
                          </span>
                          <br />
                          <ul className="grid leading-normal pl-2 font-normal">
                            {selectedLocation.map((i, idx) => (
                              <li
                                key={idx}
                                className="step step-neutral text-sm"
                                data-content={i.id}>
                                {i.id}. {i.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div id="owner-details" className="w-1/3">
                          <span className="font-medium">
                            Dataset ownership details
                          </span>
                          <br />
                          <span className="pl-2">
                            Owner: {dataset.datasetOwner?.name}
                          </span>
                          <span className="pl-2 block">
                            Email:{' '}
                            <a
                              href={`mailto:${dataset.datasetOwner?.email}`}
                              className="link italic underline-offset-2 text-secondary-700"
                              target="_blank"
                              rel="noreferrer">
                              {dataset.datasetOwner?.email}
                            </a>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            <div
              id="actions"
              className={`full-inline-between gap-4 mt-4 ${step + 1 !== 3 || loading ? 'justify-end' : ''}`}>
              {step + 1 === 3 && (
                <button
                  className={`btn btn-link btn-sm tracking-wide ${loading ? 'hidden' : ''}`}
                  disabled={loading}
                  onClick={() => setShowSurvey(true)}>
                  Take our survey and share your feedback
                </button>
              )}
              <span className="flex gap-2">
                <button
                  className="btn btn-sm btn-error btn-outline"
                  onClick={
                    step + 1 < Steps.length ? handleOnCancel : onCloseSlide
                  }>
                  {cancelConfirmed
                    ? 'Click again to cancel the process'
                    : 'Cancel'}
                </button>
                <button
                  className="btn btn-sm btn-primary min-w-24"
                  disabled={disableSubmit}
                  onClick={() => {
                    if (step + 1 < Steps.length) setStep(step + 1);
                    else {
                      setStep(0);
                      setSelectedDate(undefined);
                      setSelectedLocation(undefined);
                    }
                  }}>
                  {content.submitButtonLabel}
                </button>
              </span>
            </div>
          </div>
        ) : (
          <Survey onClose={() => setShowSurvey(false)} />
        )}
      </SlideOver>
    )
  );
};

const Survey = ({ onClose }) => {
  return (
    <div id="survey-form" className="h-full">
      <h3 className="full-inline-between text-lg capitalize opacity-70">
        <span className="flex items-center">
          Share your thoughts with us
          <TbPencilCheck className="ml-2" />
        </span>
        <button
          className="btn btn-circle btn-sm btn-ghost font-normal"
          onClick={onClose}>
          <MdClose />
        </button>
      </h3>
      <iframe
        className="border-0"
        src="https://docs.google.com/forms/d/e/1FAIpQLSd6lZdNaE_9YOs-QL2C9xm_tGGdS37GXstvGRXjtYXUUqcQwg/viewform?embedded=true"
        width="640"
        height="100%"
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
        title="Survey">
        Loading...
      </iframe>
      <div className="flex justify-center items-center">
        <button
          className="btn btn-error btn-outline btn-sm w-1/3"
          onClick={onClose}>
          Close Survey
        </button>
      </div>
    </div>
  );
};
export default FindMeHere;
