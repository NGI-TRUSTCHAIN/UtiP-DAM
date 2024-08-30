/* eslint-disable import/no-webpack-loader-syntax */

import { FaCrown, FaEuroSign } from 'react-icons/fa6';
import React, { useEffect, useRef, useState } from 'react';
import { datasetActions, datasetState } from '../store/dataset';
import { useDispatch, useSelector } from 'react-redux';

import DeleteConfirmModal from './items/DeleteConfirmModal';
import Loader from './items/Loader';
import { MdArrowRight } from 'react-icons/md';
import MessageWithTimeout from './items/MessageWithTimeout';
import { SlideOver } from './items/SlideOver';
import TagManager from 'react-gtm-module';
import { formattedNumber } from '../utils/Helper';
import { globalActions } from '../store/global';
import { authenticationActions } from '../store/authentication';

const fieldClassName =
  'input input-md bg-slate-200 shadow-sm text-primary-1400 font-medium w-full ';
const labelClassName = 'label font-medium';
const datasetTypeClass = 'btn btn-sm bg-slate-100 w-1/2 shadow';
const datasetTypeSelectedClass =
  'btn btn-sm bg-primary text-white w-1/2 shadow';

const DatasetDetails = ({ dataset, isActive, onClose }) => {
  const slideRef = useRef();

  const dispatch = useDispatch();
  const datasetGetStatus = useSelector(datasetState.getDatasetStatus);
  const deleteDatasetStatus = useSelector(datasetState.getDeleteDatasetStatus);
  const putDatasetStatus = useSelector(datasetState.getPutDatasetStatus);

  const [error, setError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    TagManager.dataLayer({
      dataLayer: {
        page: 'DatasetDetails',
        category: 'PageView',
        value: 1,
      },
      dataLayerName: 'PageDataLayer',
    });
  }, []);

  // dataset prop
  useEffect(() => {
    if (Object.keys(dataset).length > 0) {
      setFormData({
        name: dataset.name,
        description: dataset.description,
        fee: dataset.fee,
        oneDayDataPrice: dataset.fee1d,
        threeMonthsLicense: dataset.fee3mo,
        sixMonthsLicense: dataset.fee6mo,
        twelveMonthsLicense: dataset.fee12mo,
        dataPoints: dataset.dataPoints,
        datasetOwner: dataset.datasetOwner,
        downloadCount: dataset.downloadCount,
        datasetType: dataset.fee > 0 ? 'premium' : 'free',
        isShareOnUtip: dataset.publish,
        isShareOnDataSpace: dataset.publishMDS,
        updatedOn: dataset.updatedOn,
        publish: dataset.publish,
      });
    } else setFormData(null);
  }, [dataset]);

  useEffect(() => {
    if (deleteDatasetStatus.ok) {
      dispatch(
        globalActions.setToaster({
          message: 'Dataset has been successfully deleted.',
          type: 'info',
        })
      );
      dispatch(authenticationActions.myDatasetsApiReq());
      onClose();
    } else if (deleteDatasetStatus.error) setError(deleteDatasetStatus.message);
  }, [deleteDatasetStatus, dispatch]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? !formData[name] : value,
    });
  };

  const handleDatasetTypeChange = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      datasetType: formData.datasetType === 'premium' ? 'free' : 'premium',
    });
  };

  const handleDelete = () => {
    dispatch(
      datasetActions.datasetDeleteApiReq({
        params: dataset.datasetDefinitionId,
        allDates: true,
      })
    );
    setIsDeleteModalOpen(false);
  };

  const handleSaveClick = () => {
    dispatch(
      datasetActions.datasetPutApiReq({
        data: {
          name: formData.name,
          description: formData.description,
          fee: formData.fee,
          fee1d: formData.oneDayDataPrice,
          fee3mo: formData.threeMonthsLicense,
          fee6mo: formData.sixMonthsLicense,
          fee12mo: formData.twelveMonthsLicense,
          dataPoints: formData.dataPoints,
          datasetOwner: formData.datasetOwner,
          downloadCount: formData.downloadCount,
          datasetType: formData.fee > 0 ? 'premium' : 'free',
          updatedOn: formData.updatedOn,
          publish: formData.isShareOnUtip,
          publishMDS: formData.isShareOnDataSpace,
        },
        params: dataset.datasetDefinitionId,
      })
    );
  };

  useEffect(() => {
    if (putDatasetStatus.ok) {
      dispatch(
        globalActions.setToaster({
          message: 'Dataset has been successfully edited.',
          type: 'info',
        })
      );
      dispatch(authenticationActions.myDatasetsApiReq());
      dispatch(
        datasetActions.updatePutDatasetStatus({
          loading: false,
          error: false,
          ok: false,
          message: null,
        })
      );
      onClose();
    } else if (putDatasetStatus.error) setError(putDatasetStatus.message);
  }, [putDatasetStatus, dispatch]);

  return (
    <SlideOver
      ref={slideRef}
      title={
        <span className={'flex items-center'}>
          My Datasets <MdArrowRight size={22} />
          {dataset.name}
          {formData !== null && formData.datasetType === 'premium' && (
            <span className="flex items-center mx-1 text-amber-400 text-xs">
              <FaCrown />
            </span>
          )}
        </span>
      }
      open={isActive}
      onClose={() => onClose()}>
      {datasetGetStatus.loading || formData === null ? (
        <Loader fixed={false} className="py-4" message={'Retrieving Dataset'} />
      ) : (
        <div id="content" className="mx-4">
          <form>
            <div className="form-control w-full gap-3">
              <span id="name">
                <label htmlFor="name" className={labelClassName}>
                  <span className="label-text">Dataset Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className={fieldClassName}
                  value={formData.name}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </span>
              <span id="description">
                <label htmlFor="description" className={labelClassName}>
                  <span className="label-text">Dataset Description</span>
                </label>
                <input
                  type="textarea"
                  name="description"
                  className={fieldClassName}
                  value={formData.description}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </span>
              <span id="datasetType">
                {isEditing && (
                  <>
                    <label htmlFor="datasetType" className={labelClassName}>
                      <span className="label-text">Dataset Type</span>
                    </label>
                    <span className="full-inline-between gap-3">
                      <button
                        className={
                          formData.datasetType === 'premium'
                            ? datasetTypeSelectedClass
                            : datasetTypeClass
                        }
                        onClick={handleDatasetTypeChange}
                        disabled={!isEditing}>
                        <FaCrown className="mx-1 text-amber-400 text-xs" />
                        Premium Dataset
                      </button>
                      <button
                        className={
                          formData.datasetType === 'free'
                            ? datasetTypeSelectedClass
                            : datasetTypeClass
                        }
                        onClick={handleDatasetTypeChange}
                        disabled={!isEditing}>
                        Free Dataset
                      </button>
                    </span>
                  </>
                )}
              </span>
              {formData.datasetType === 'premium' && (
                <div
                  id="premium-purchase-details"
                  className="border-b-2 pb-4 mt-[-.5rem] px-2">
                  <label htmlFor="past-data-price" className={labelClassName}>
                    <span className="label-text">
                      Price for purchasing past data (in Euros)
                    </span>
                  </label>
                  <span className="flex w-full gap-4">
                    <input
                      type="text"
                      name="oneDayDataPrice"
                      className={fieldClassName + 'flex w-1/2'}
                      value={formData.oneDayDataPrice || ''}
                      placeholder="One day data"
                      onChange={handleChange}
                      readOnly={!isEditing}
                    />
                    <span
                      className={fieldClassName + 'flex w-1/2 items-center'}>
                      <input
                        type="text"
                        name="allDataPrice"
                        className={fieldClassName + 'flex w-1/2'}
                        value={formData.fee || ''}
                        placeholder="All available data at time of purchase"
                        onChange={handleChange}
                        readOnly
                      />
                    </span>
                  </span>
                  <div id="future-data-price">
                    <label
                      htmlFor="future-data-price"
                      className={labelClassName}>
                      <span className="label-text">
                        Price for purchasing future data (in Euros)
                      </span>
                    </label>
                    <span id="future-data-price" className="flex gap-4">
                      <input
                        type="text"
                        name="threeMonthsLicense"
                        className={fieldClassName + 'flex w-1/3'}
                        value={formData.threeMonthsLicense || ''}
                        placeholder="3-months license"
                        onChange={handleChange}
                        readOnly={!isEditing}
                      />
                      <input
                        type="text"
                        name="sixMonthsLicense"
                        className={fieldClassName + 'flex w-1/3'}
                        value={formData.sixMonthsLicense || ''}
                        placeholder="6-months license"
                        onChange={handleChange}
                        readOnly={!isEditing}
                      />
                      <input
                        type="text"
                        name="twelveMonthsLicense"
                        className={fieldClassName + 'flex w-1/3'}
                        value={formData.twelveMonthsLicense || ''}
                        placeholder="12-months license"
                        onChange={handleChange}
                        readOnly={!isEditing}
                      />
                    </span>
                  </div>
                </div>
              )}
              <div id="shareSettings">
                <label htmlFor="shareSettings" className={labelClassName}>
                  <span className="label-text flex items-center">
                    Sharing Settings
                  </span>
                </label>
                <div className="flex gap-4">
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      name="isShareOnUtip"
                      className="checkbox checkbox-sm"
                      checked={formData.isShareOnUtip}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="label-text mx-2">
                      Share on Utip-DAM marketplace
                    </span>
                  </label>
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      name="isShareOnDataSpace"
                      className="checkbox checkbox-sm"
                      checked={formData.isShareOnDataSpace}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="label-text mx-2">
                      Share on the Mobility Data Space
                    </span>
                  </label>
                </div>
              </div>
              <div id="fee&dataPoints" className="flex gap-4">
                <span className="flex flex-col w-1/4">
                  <label htmlFor="fee" className={labelClassName}>
                    <span className="label-text flex items-center">
                      Dataset Fee
                    </span>
                  </label>
                  <label
                    className={
                      'input input-ghost flex items-center gap-1 ' +
                      fieldClassName
                    }>
                    <FaEuroSign className="text-gray-500 mx-1" size={11} />
                    <input
                      type="text"
                      name="fee"
                      className="grow w-full"
                      value={formData.fee}
                      onChange={handleChange}
                      readOnly={!isEditing}
                    />
                  </label>
                </span>
                <span className="flex flex-col w-2/3">
                  <label htmlFor="share-settings" className={labelClassName}>
                    <span className="label-text">Share Settings</span>
                  </label>
                  <input
                    type="text"
                    name="share-settings"
                    className={fieldClassName}
                    value={
                      formData.publish
                        ? 'Share on Utip-DAM marketplace'
                        : 'Not shared (private)'
                    }
                    onChange={handleChange}
                    readOnly={!isEditing}
                  />
                </span>
                <div className="flex flex-col w-1/3">
                  <label htmlFor="data-points" className={labelClassName}>
                    <span className="label-text">Data Points</span>
                  </label>
                  <input
                    type="text"
                    name="dataPoints"
                    className={fieldClassName}
                    value={formattedNumber(formData.dataPoints)}
                    onChange={handleChange}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="dataset-contact-details"
                  className={labelClassName}>
                  <span className="label-text">Dataset Contact Details</span>
                </label>
                <span className="flex w-full gap-4">
                  <input
                    type="text"
                    name="datasetOwner"
                    className={fieldClassName + 'flex w-1/2'}
                    value={formData.datasetOwner?.name}
                    onChange={handleChange}
                    readOnly={!isEditing}
                  />
                  <span className={fieldClassName + 'flex w-1/2 items-center'}>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        className={fieldClassName + 'flex w-1/2'}
                        value={formData.datasetOwner?.email}
                        onChange={handleChange}
                        readOnly={!isEditing}
                      />
                    ) : (
                      <a
                        href={`mailto:${formData.datasetOwner?.email}`}
                        className="underline"
                        target="_blank"
                        rel="noreferrer">
                        {formData.datasetOwner?.email}
                      </a>
                    )}
                  </span>
                </span>
              </div>
              <div id="downloadCount">
                <label htmlFor="download-count" className={labelClassName}>
                  <span className="label-text">
                    Dataset Download{' '}
                    <span className="text-slate-400">
                      (Updated: {formData.updatedOn})
                    </span>
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  className={fieldClassName}
                  value={formData.downloadCount ?? '-'}
                  readOnly
                />
              </div>
            </div>
          </form>
          {error && (
            <MessageWithTimeout timeout={false} className="px-0 text-error">
              <div role="alert" className="text-error">
                <span>
                  {typeof error === 'object'
                    ? Object.values(error).join(', ')
                    : error}
                </span>
              </div>
            </MessageWithTimeout>
          )}
          <div
            id="actions"
            className="w-full inline-flex justify-end gap-6 mt-4">
            {isEditing ? (
              <button
                className="btn btn-sm btn-outline btn-error"
                onClick={() => {
                  onClose();
                  // setFormData(null);
                }}>
                Cancel
              </button>
            ) : (
              <button
                className="btn btn-sm btn-outline btn-error"
                onClick={() => {
                  setIsDeleteModalOpen(true);
                }}>
                Remove Dataset
              </button>
            )}
            {!isEditing ? (
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => setIsEditing(true)}>
                Edit Dataset Details
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => handleSaveClick()}>
                Save Changes
              </button>
            )}
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          confirmDelete={handleDelete}
        />
      )}
    </SlideOver>
  );
};

export default DatasetDetails;
