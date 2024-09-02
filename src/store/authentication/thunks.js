import {
  deActivateAccountApi,
  deleteAccountApi,
  downloadPremiumApi,
  licenseActivationApi,
  licenseApi,
  licenseDeactivationApi,
  licenseDeleteApi,
  licensesApi,
  myDatasetsApi,
  myPurchasesApi,
  pendingLicensesApi,
  purchaseDetailsApi,
  signinApi,
  signupApi,
  updateAccountApi,
  updateAccountPasswordApi,
  vendorApi,
} from '../../apis/authentication';

import Cookies from 'universal-cookie';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleDownloadBlobFile } from '../dataset/thunks';
import useHandleApiError from '../../utils/Helper';

const cookies = new Cookies();

export const authenticateUserApiReq = createAsyncThunk(
  'authentication/authenticateUserApiReq',
  async (payload, { dispatch, rejectWithValue }) => {
    const source = axios.CancelToken.source();
    const request = {
      data: payload.data,
    };
    try {
      if (payload.type === 'signin') {
        const response = await signinApi({
          request,
          source,
        });
        if (response.data) {
          cookies.set('token', response?.data?.token, {
            path: '/',
            // secure: true,
            secure: false,
          });
          cookies.set(
            'account',
            {
              username: response?.data?.username,
              email: response?.data?.email,
            },
            {
              path: '/',
              // secure: true,
              secure: false,
            }
          );
          return response.data;
        }
      } else {
        // payload.type=== signup
        const response = await signupApi({
          request,
          source,
        });
        return response.data;
      }
    } catch (err) {
      return useHandleApiError(err, rejectWithValue, dispatch);
    }
  }
);

export const deActivateAccountApiReq = createAsyncThunk(
  'authentication/deActivateAccountApiReq',
  async (payload, { dispatch, rejectWithValue }) => {
    const source = axios.CancelToken.source();
    const request = {
      params: payload?.params,
    };
    try {
      const response = await deActivateAccountApi({
        request,
        source,
      });
      return response.data;
    } catch (err) {
      return useHandleApiError(err, rejectWithValue, dispatch);
    }
  }
);

export const updateAccountApiReq = createAsyncThunk(
  'authentication/updateAccountApiReq',
  async (payload, { dispatch, rejectWithValue }) => {
    const source = axios.CancelToken.source();
    const request = {
      data: payload.data,
    };
    try {
      const response = await updateAccountApi({
        request,
        source,
      });
      return response.data;
    } catch (err) {
      return useHandleApiError(err, rejectWithValue, dispatch);
    }
  }
);

export const updateAccountPasswordApiReq = createAsyncThunk(
  'authentication/updateAccountPasswordApiReq',
  async (payload, { dispatch, rejectWithValue }) => {
    const source = axios.CancelToken.source();
    const request = {
      data: payload.data,
    };
    try {
      const response = await updateAccountPasswordApi({
        request,
        source,
      });
      return response.data;
    } catch (err) {
      return useHandleApiError(err, rejectWithValue, dispatch);
    }
  }
);

export const myDatasetsApiReq = createAsyncThunk(
  'authentication/myDatasetsApiReq',
  async (payload, { dispatch, rejectWithValue }) => {
    const source = axios.CancelToken.source();
    const request = {
      params: payload?.params,
    };
    try {
      const response = await myDatasetsApi({
        request,
        source,
      });
      return response.data;
    } catch (err) {
      return useHandleApiError(err, rejectWithValue, dispatch);
    }
  }
);

export const vendorApiReq = createAsyncThunk(
  'authentication/vendorApiReq',
  async (payload, { dispatch, rejectWithValue }) => {
    const source = axios.CancelToken.source();
    const request = {
      data: payload?.data,
      params: payload?.params,
    };
    const method = payload?.method || 'get';
    try {
      const response = await vendorApi({
        request,
        method,
        source,
      });
      return response.data;
    } catch (err) {
      return useHandleApiError(err, rejectWithValue, dispatch, true);
    }
  }
);

export const licenseApiReq = createAsyncThunk(
  'authentication/licenseApiReq',
  async (payload, { dispatch, rejectWithValue }) => {
    const source = axios.CancelToken.source();
    const request = {
      id: payload?.id,
      data: payload?.data,
      params: payload?.params,
    };
    const method = payload?.method;

    try {
      const response = await licenseApi({
        request,
        method,
        source,
      });
      return response.data;
    } catch (err) {
      return useHandleApiError(err, rejectWithValue, dispatch, true);
    }
  }
);

export const licensesApiReq = createAsyncThunk(
  'authentication/licensesApiReq',
  async (payload, { dispatch, rejectWithValue }) => {
    const source = axios.CancelToken.source();
    const request = {
      params: payload?.params,
    };

    try {
      const response = await licensesApi({
        request,
        source,
      });
      return response.data;
    } catch (err) {
      return useHandleApiError(err, rejectWithValue, dispatch, true);
    }
  }
);

export const pendingLicensesApiReq = createAsyncThunk(
  'authentication/pendingLicensesApiReq',
  async (payload, { dispatch, rejectWithValue }) => {
    const source = axios.CancelToken.source();
    const request = {
      params: payload?.params,
    };

    try {
      const response = await pendingLicensesApi({
        request,
        source,
      });
      return response.data;
    } catch (err) {
      return useHandleApiError(err, rejectWithValue, dispatch, true);
    }
  }
);

export const licenseActivationApiReq = createAsyncThunk(
  'authentication/licenseActivationApiReq',
  async (payload, { dispatch, rejectWithValue }) => {
    const source = axios.CancelToken.source();
    const request = {
      id: payload?.id,
    };

    try {
      const response = await licenseActivationApi({
        request,
        source,
      });
      return response.data;
    } catch (err) {
      return useHandleApiError(err, rejectWithValue, dispatch, true);
    }
  }
);

export const licenseDeactivationApiReq = createAsyncThunk(
  'authentication/licenseDeactivationApiReq',
  async (payload, { dispatch, rejectWithValue }) => {
    const source = axios.CancelToken.source();
    const request = {
      id: payload?.id,
    };

    try {
      const response = await licenseDeactivationApi({
        request,
        source,
      });
      return response.data;
    } catch (err) {
      return useHandleApiError(err, rejectWithValue, dispatch, true);
    }
  }
);
export const licenseDeleteApiReq = createAsyncThunk(
  'authentication/licenseDeleteApiReq',
  async (payload, { dispatch, rejectWithValue }) => {
    const source = axios.CancelToken.source();
    const request = {
      id: payload?.id,
    };

    try {
      const response = await licenseDeleteApi({
        request,
        source,
      });
      return response.data;
    } catch (err) {
      return useHandleApiError(err, rejectWithValue, dispatch, true);
    }
  }
);

export const downloadPremiumApiReq = createAsyncThunk(
  'authentication/downloadPremiumApiReq',
  async (payload, { dispatch, rejectWithValue }) => {
    const source = axios.CancelToken.source();
    const request = {
      apiKey: payload?.apiKey,
      params: payload?.params,
    };

    try {
      const response = await downloadPremiumApi({
        request,
        source,
      });
      if (response) {
        handleDownloadBlobFile(response, payload?.filename ?? 'dataset_data');
      }
    } catch (err) {
      return useHandleApiError(err, rejectWithValue, dispatch, true);
    }
  }
);

export const deleteAccountApiReq = createAsyncThunk(
  'authentication/deleteAccountApiReq',
  async ({ dispatch, rejectWithValue }) => {
    const source = axios.CancelToken.source();

    try {
      const response = await deleteAccountApi({ source });
      return response.data;
    } catch (err) {
      return useHandleApiError(err, rejectWithValue, dispatch, true);
    }
  }
);
export const myPurchasesApiReq = createAsyncThunk(
  'authentication/myPurchasesApiReq',
  async (payload, { dispatch, rejectWithValue }) => {
    const source = axios.CancelToken.source();
    const request = {
      params: payload?.params,
    };
    try {
      const response = await myPurchasesApi({ request, source });
      return response.data;
    } catch (err) {
      return useHandleApiError(err, rejectWithValue, dispatch, true);
    }
  }
);

export const purchaseDetailsApiReq = createAsyncThunk(
  'authentication/purchaseDetailsApiReq',
  async (payload, { dispatch, rejectWithValue }) => {
    const source = axios.CancelToken.source();
    const request = {
      id: payload,
    };
    try {
      const response = await purchaseDetailsApi({ request, source });
      return response.data;
    } catch (err) {
      return useHandleApiError(err, rejectWithValue, dispatch, true);
    }
  }
);
