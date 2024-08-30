import {
  checkoutApi,
  datasetApi,
  datasetDeleteApi,
  datasetUpdateApi,
  datasetPutApi,
  datasetsApi,
  emailSendApi,
  locationsApi,
  mobilityDatasetDownloadApi,
} from '../../apis/dataset';

import axios from 'axios';
import { camelCase } from 'lodash';
import { createAsyncThunk } from '@reduxjs/toolkit';
import useHandleApiError from '../../utils/Helper';

export const checkoutApiReq = createAsyncThunk(
  'dataset/checkoutApiReq',
  async (payload, { dispatch, rejectWithValue }) => {
    const source = axios.CancelToken.source();
    try {
      const response = await checkoutApi({
        request: { data: payload.data },
        source,
      });
      return response?.data;
    } catch (err) {
      return useHandleApiError(err, rejectWithValue, dispatch);
    }
  }
);

export const datasetsApiReq = createAsyncThunk(
  'dataset/datasetsApiReq',
  async ({ dispatch, rejectWithValue }) => {
    const source = axios.CancelToken.source();
    try {
      const response = await datasetsApi({
        source,
      });
      return response?.data;
    } catch (err) {
      return useHandleApiError(err, rejectWithValue, dispatch);
    }
  }
);

export const datasetGetApiReq = createAsyncThunk(
  'dataset/datasetGetApiReq',
  async (payload, { dispatch, rejectWithValue }) => {
    const source = axios.CancelToken.source();
    try {
      const response = await datasetApi({
        request: { params: payload.params },
        source,
      });
      return response?.data;
    } catch (err) {
      return useHandleApiError(err, rejectWithValue, dispatch, true);
    }
  }
);

export const datasetPutApiReq = createAsyncThunk(
  'dataset/datasetPutApiReq',
  async (payload, { dispatch, rejectWithValue }) => {
    const source = axios.CancelToken.source();
    const request = {
      data: payload.data,
      params: payload.params,
    };
    try {
      const response = await datasetPutApi({
        request,
        source,
      });

      return response.data;
    } catch (err) {
      return useHandleApiError(err, rejectWithValue, dispatch);
    }
  }
);

export const datasetDeleteApiReq = createAsyncThunk(
  'dataset/datasetDeleteApiReq',
  async (payload, { dispatch, rejectWithValue }) => {
    const source = axios.CancelToken.source();
    try {
      const response = await datasetDeleteApi({
        request: {
          params: payload.params,
          allDates: payload?.allDates || false,
        },
        source,
      });
      return response?.data;
    } catch (err) {
      return useHandleApiError(err, rejectWithValue, dispatch, true);
    }
  }
);

export const datasetUpdateApiReq = createAsyncThunk(
  'dataset/datasetUpdateApiReq',
  async (payload, { dispatch, rejectWithValue }) => {
    const source = axios.CancelToken.source();
    const request = {
      data: payload.data,
      params: payload.param,
    };
    try {
      const response = await datasetUpdateApi({
        request,
        source,
      });

      return response.data;
    } catch (err) {
      return useHandleApiError(err, rejectWithValue, dispatch, true);
    }
  }
);

export const emailSendApiReq = createAsyncThunk(
  'dataset/emailSendApiReq',
  async (payload, { dispatch, rejectWithValue }) => {
    const source = axios.CancelToken.source();
    const request = {
      data: payload.data,
    };
    try {
      const response = await emailSendApi({
        request,
        source,
      });

      return response.data;
    } catch (err) {
      return useHandleApiError(err, rejectWithValue, dispatch);
    }
  }
);

export const getDatasetLocationsApiReq = createAsyncThunk(
  'anonymization/dataset/location-get-api',
  async (payload, { dispatch, rejectWithValue }) => {
    const source = axios.CancelToken.source();
    const request = {
      data: payload.data,
      params: payload.params,
    };

    try {
      const response = await locationsApi({
        request,
        source,
      });

      return response?.data;
    } catch (err) {
      return useHandleApiError(err, rejectWithValue, dispatch);
    }
  }
);

// Function to handle API response and initiate file download
export const handleDownloadBlobFile = (response, filename) => {
  let blob = new Blob([response.data], {
    type: response.headers['content-type'],
  });

  let link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.target = '_self';
  link.setAttribute('download', `${camelCase(filename) ?? 'dataset'}.zip`);
  link.click();
};

export const mobilityDatasetDownloadApiReq = createAsyncThunk(
  'dataset/download-mobility-dataset',
  async (payload, { dispatch, rejectWithValue }) => {
    const source = axios.CancelToken.source();
    const request = {
      params: payload.params,
    };

    try {
      const response = await mobilityDatasetDownloadApi({
        request,
        source,
      });
      if (response) {
        handleDownloadBlobFile(response, payload?.filename);
      }
    } catch (err) {
      return useHandleApiError(err, rejectWithValue, dispatch);
    }
  }
);
