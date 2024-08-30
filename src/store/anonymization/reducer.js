import {
  mobilityAnonymizationApiReq,
  mobilityAuditApiReq,
  visitorDetectionApiReq,
} from './thunks';

import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = {
  audit_dataset: {
    data: {},
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
  mobility_upload: {
    data: [],
    performance_metrics_data: {},
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
  mobility_download: {
    data: [],
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
  visitor_detection: {
    data: {},
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
};

const anonymizationSlice = createSlice({
  name: 'anonymization',
  initialState: INITIAL_STATE,
  reducers: {
    initializeState: (state, { payload }) => {
      if (payload) {
        const { key } = payload;
        state[key] = INITIAL_STATE[key];
      } else return INITIAL_STATE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(mobilityAuditApiReq.pending, (state) => {
        state.audit_dataset.status = {
          ...INITIAL_STATE.audit_dataset.status,
        };
        state.audit_dataset.status.loading = true;
      })
      .addCase(mobilityAuditApiReq.rejected, (state, { error, payload }) => {
        state.audit_dataset.status.loading = false;
        state.audit_dataset.status.error = true;
        state.audit_dataset.status.message = payload || error.message;
      })
      .addCase(mobilityAuditApiReq.fulfilled, (state, { payload }) => {
        state.audit_dataset.status.loading = false;
        state.audit_dataset.status.ok = true;
        state.audit_dataset.data = payload;
      })
      .addCase(mobilityAnonymizationApiReq.pending, (state, { meta }) => {
        if (meta.arg?.method === 'post') {
          state.mobility_upload.status = {
            ...INITIAL_STATE.mobility_upload.status,
          };
          state.mobility_upload.status.loading = true;
        } else {
          state.mobility_download.status = {
            ...INITIAL_STATE.mobility_download.status,
          };
          state.mobility_download.status.loading = true;
        }
      })
      .addCase(
        mobilityAnonymizationApiReq.rejected,
        (state, { meta, error, payload }) => {
          if (meta.arg?.method === 'post') {
            state.mobility_upload.status.loading = false;
            state.mobility_upload.status.error = true;
            state.mobility_upload.status.message = payload || error.message;
          } else {
            state.mobility_download.status.loading = false;
            state.mobility_download.status.error = true;
            state.mobility_download.status.message = payload || error.message;
          }
        }
      )
      .addCase(
        mobilityAnonymizationApiReq.fulfilled,
        (state, { meta, payload }) => {
          if (meta.arg?.method === 'post') {
            state.mobility_upload.status.loading = false;
            state.mobility_upload.status.ok = true;
            state.mobility_upload.data = payload.data;
            state.mobility_upload.performance_metrics_data =
              payload.metricsHeader;
            window.sessionStorage.setItem(
              'datasetPID',
              payload.data?.datasetDefinitionId
            );
          } else {
            state.mobility_download.status.loading = false;
            state.mobility_download.status.ok = true;
            state.mobility_download.data = payload.data;
          }
        }
      )
      .addCase(visitorDetectionApiReq.pending, (state) => {
        state.visitor_detection.data = {};
        state.visitor_detection.status = {
          ...INITIAL_STATE.visitor_detection.status,
        };

        state.visitor_detection.status.loading = true;
      })
      .addCase(visitorDetectionApiReq.rejected, (state, { payload, error }) => {
        state.visitor_detection.status.loading = false;
        state.visitor_detection.status.error = true;
        state.visitor_detection.status.message = payload || error?.message;
      })
      .addCase(visitorDetectionApiReq.fulfilled, (state, { payload }) => {
        state.visitor_detection.status.loading = false;
        state.visitor_detection.status.ok = true;
        state.visitor_detection.data = payload;
      });
  },
});

export default anonymizationSlice;
