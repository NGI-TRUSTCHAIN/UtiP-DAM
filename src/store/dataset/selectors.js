import { createSelector } from '@reduxjs/toolkit';

const getDatasetsData = (state) => state.dataset.datasets.data;
const getDatasetsStatus = (state) => state.dataset.datasets.status;
const getDatasetData = (state) => state.dataset.dataset.data;
const getDatasetStatus = (state) => state.dataset.dataset.status;
const getPutDatasetData = (state) => state.dataset.put_dataset.data;
const getPutDatasetStatus = (state) => state.dataset.put_dataset.status;
const getDeleteDatasetStatus = (state) => state.dataset.delete_dataset.status;
const getCreateDatasetStatus = (state) =>
  state.dataset.dataset_update.create_status;
const getCreateDatasetData = (state) => state.dataset.dataset_update.data;
const getEditDatasetStatus = (state) =>
  state.dataset.dataset_update.edit_status;
const getEmailSendData = (state) => state.dataset.send_email.data;
const getEmailSendStatus = (state) => state.dataset.send_email.status;

const getLocationsGetData = (state) => state.dataset.locations.data;
const getLocationsGetStatus = (state) => state.dataset.locations.status;

const getDownloadDatasetData = (state) => state.dataset.download_dataset.data;
const getDownloadDatasetStatus = (state) =>
  state.dataset.download_dataset.status;

const getCheckoutData = (state) => state.dataset.checkout.data;
const getCheckoutStatus = (state) => state.dataset.checkout.status;

const selectDatasetsList = createSelector([getDatasetsData], (datasets) => {
  if (datasets?.length > 0) {
    let result = datasets.filter((d) => d.publish);
    result = result.map((parentDataset) => {
      return {
        ...parentDataset,
        dates: parentDataset.datasets.map((i) => i.fileDate),
      };
    });

    return result;
  }
});

export const datasetState = {
  getDatasetsData,
  getDatasetsStatus,
  getDatasetData,
  getDatasetStatus,
  getPutDatasetData,
  getPutDatasetStatus,
  getDeleteDatasetStatus,
  getCreateDatasetStatus,
  getCreateDatasetData,
  getEditDatasetStatus,
  getEmailSendData,
  getEmailSendStatus,
  getLocationsGetData,
  getLocationsGetStatus,
  getDownloadDatasetData,
  getDownloadDatasetStatus,
  getCheckoutData,
  getCheckoutStatus,
  selectDatasetsList,
};
