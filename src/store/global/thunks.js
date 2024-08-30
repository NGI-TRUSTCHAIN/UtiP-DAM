import { anonymizeApi } from '../../apis/anonymization';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const mobilityAnonymizationApiReq = createAsyncThunk(
  'anonymization/mobility-api',
  async (payload, { rejectWithValue }) => {
    const source = axios.CancelToken.source();
    const request = {
      data: payload.data,
      params: payload.params,
    };
    const method = payload?.method || 'post'; // Post | Get

    try {
      const response = await anonymizeApi({
        request,
        method,
        source,
      });

      return response?.data;
    } catch (err) {
      if (err?.error) {
        return rejectWithValue({ error: err.error });
      }
      if (err.response?.data.status === 400) {
        return rejectWithValue({
          ...err.response.data,
          error: 'Bad Request. Please check the csv file for right format.',
        });
      } else if (err.response?.data.status === 500) {
        return rejectWithValue({
          ...err.response.data,
          error: 'Server error. Try again later.',
        });
      }
      return rejectWithValue(err.response?.data);
    }
  }
);
