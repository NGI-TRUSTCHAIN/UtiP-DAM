import {
  checkoutApiReq,
  datasetDeleteApiReq,
  datasetGetApiReq,
  datasetPutApiReq,
  datasetUpdateApiReq,
  datasetsApiReq,
  emailSendApiReq,
  getDatasetLocationsApiReq,
  mobilityDatasetDownloadApiReq,
} from './thunks';

import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = {
  checkout: {
    data: {},
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
  datasets: {
    data: [],
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
  dataset: {
    data: {},
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
  put_dataset: {
    data: {},
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
  delete_dataset: {
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
  download_dataset: {
    data: {},
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
  dataset_update: {
    data: [],
    create_status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
    edit_status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
  locations: {
    data: [],
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
  send_email: {
    data: {},
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
};

const datasetSlice = createSlice({
  name: 'dataset',
  initialState: INITIAL_STATE,
  reducers: {
    initializeState: (state, { payload }) => {
      if (payload) {
        const { key } = payload;
        state[key] = INITIAL_STATE[key];
      } else return INITIAL_STATE;
    },
    updatePutDatasetStatus: (state, { payload }) => {
      state.put_dataset.status = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(datasetsApiReq.pending, (state) => {
        state.datasets.status = { ...INITIAL_STATE.datasets.status };
        state.datasets.status.loading = true;
      })
      .addCase(datasetsApiReq.rejected, (state, { error, payload }) => {
        state.datasets.status.loading = false;
        state.datasets.status.error = true;
        state.datasets.status.message = payload || error.message;
      })
      .addCase(datasetsApiReq.fulfilled, (state, { payload }) => {
        state.datasets.status.loading = false;
        state.datasets.status.ok = true;
        state.datasets.data = payload.data;
      })
      .addCase(datasetGetApiReq.pending, (state) => {
        state.dataset.status = { ...INITIAL_STATE.dataset.status };
        state.dataset.status.loading = true;
      })
      .addCase(datasetGetApiReq.rejected, (state, { error, payload }) => {
        state.dataset.status.loading = false;
        state.dataset.status.error = true;
        state.dataset.status.message = payload?.error || error.message;
      })
      .addCase(datasetGetApiReq.fulfilled, (state, { payload }) => {
        state.dataset.status.loading = false;
        state.dataset.status.ok = true;
        state.dataset.data = payload.data;
      })
      // datasetPutApiReq
      .addCase(datasetPutApiReq.pending, (state) => {
        state.put_dataset.status = { ...INITIAL_STATE.dataset.status };
        state.put_dataset.status.loading = true;
      })
      .addCase(datasetPutApiReq.rejected, (state, { error, payload }) => {
        state.put_dataset.status.loading = false;
        state.put_dataset.status.error = true;
        state.put_dataset.status.message = payload?.error || error.message;
      })
      .addCase(datasetPutApiReq.fulfilled, (state, { payload }) => {
        state.put_dataset.status.loading = false;
        state.put_dataset.status.ok = true;
        state.put_dataset.data = payload.data;
      })
      .addCase(datasetDeleteApiReq.pending, (state) => {
        state.delete_dataset.status = {
          ...INITIAL_STATE.delete_dataset.status,
        };
        state.delete_dataset.status.loading = true;
      })
      .addCase(datasetDeleteApiReq.rejected, (state, { error, payload }) => {
        state.delete_dataset.status.loading = false;
        state.delete_dataset.status.error = true;
        state.delete_dataset.status.message = payload?.error || error.message;
      })
      .addCase(datasetDeleteApiReq.fulfilled, (state, { payload }) => {
        state.delete_dataset.status.loading = false;
        state.delete_dataset.status.ok = true;
        // state.delete_dataset.data = payload.data;
      })
      .addCase(datasetUpdateApiReq.pending, (state, { meta }) => {
        if (meta.arg?.type === 'create') {
          state.dataset_update.create_status.loading = true;
        } else state.dataset_update.edit_status.loading = true;
      })
      .addCase(
        datasetUpdateApiReq.rejected,
        (state, { meta, error, payload }) => {
          if (meta.arg?.type === 'create') {
            state.dataset_update.create_status.loading = false;
            state.dataset_update.create_status.error = true;
            state.dataset_update.create_status.message =
              payload?.error || error.message;
          } else {
            state.dataset_update.edit_status.loading = false;
            state.dataset_update.edit_status.error = true;
            state.dataset_update.edit_status.message =
              payload?.error || error.message;
          }
        }
      )
      .addCase(datasetUpdateApiReq.fulfilled, (state, { meta, payload }) => {
        if (meta.arg?.type === 'create') {
          state.dataset_update.create_status.loading = false;
          state.dataset_update.create_status.ok = true;
          state.dataset_update.data = payload?.data;
        } else {
          state.dataset_update.edit_status.loading = false;
          state.dataset_update.edit_status.ok = true;
        }

        state.dataset_update.data = payload;
      })
      .addCase(emailSendApiReq.pending, (state) => {
        state.send_email.status = { ...INITIAL_STATE.send_email.status };
        state.send_email.status.loading = true;
      })
      .addCase(emailSendApiReq.rejected, (state, { error, payload }) => {
        state.send_email.status.loading = false;
        state.send_email.status.error = true;
        state.send_email.status.message = payload?.data || error.message;
      })
      .addCase(emailSendApiReq.fulfilled, (state, { payload }) => {
        state.send_email.status.loading = false;
        state.send_email.status.ok = true;
        state.send_email.data = payload;
      })
      .addCase(getDatasetLocationsApiReq.pending, (state) => {
        state.locations.status = { ...INITIAL_STATE.locations.status };
        state.locations.status.loading = true;
      })
      .addCase(
        getDatasetLocationsApiReq.rejected,
        (state, { error, payload }) => {
          state.locations.status.loading = false;
          state.locations.status.error = true;
          state.locations.status.message = payload || error.message;
        }
      )
      .addCase(getDatasetLocationsApiReq.fulfilled, (state, { payload }) => {
        state.locations.status.loading = false;
        state.locations.status.ok = true;
        state.locations.data = payload.data;
      })
      .addCase(mobilityDatasetDownloadApiReq.pending, (state) => {
        state.download_dataset.status = {
          ...INITIAL_STATE.download_dataset.status,
        };
        state.download_dataset.status.loading = true;
      })
      .addCase(
        mobilityDatasetDownloadApiReq.rejected,
        (state, { payload, error }) => {
          state.download_dataset.status.loading = false;
          state.download_dataset.status.error = true;
          state.download_dataset.status.message = payload || error.message;
        }
      )
      .addCase(
        mobilityDatasetDownloadApiReq.fulfilled,
        (state, { payload }) => {
          state.download_dataset.status.loading = false;
          state.download_dataset.status.ok = true;
          state.download_dataset.data = payload;
        }
      )
      .addCase(checkoutApiReq.pending, (state) => {
        state.checkout.status = { ...INITIAL_STATE.checkout.status };
        state.checkout.status.loading = true;
      })
      .addCase(checkoutApiReq.rejected, (state, { payload, error }) => {
        state.checkout.status.loading = false;
        state.checkout.status.error = true;
        state.checkout.status.message = payload || error.message;
      })
      .addCase(checkoutApiReq.fulfilled, (state, { payload }) => {
        state.checkout.status.loading = false;
        state.checkout.status.ok = true;
        state.checkout.data = payload?.data || payload;
      });
  },
});

export default datasetSlice;
