import {
  authenticateUserApiReq,
  deActivateAccountApiReq,
  deleteAccountApiReq,
  downloadPremiumApiReq,
  licenseActivationApiReq,
  licenseApiReq,
  licenseDeactivationApiReq,
  licenseDeleteApiReq,
  licensesApiReq,
  myDatasetsApiReq,
  myPurchasesApiReq,
  pendingLicensesApiReq,
  purchaseDetailsApiReq,
  updateAccountApiReq,
  updateAccountPasswordApiReq,
  vendorApiReq,
} from './thunks';

import Cookies from 'universal-cookie';
import { createSlice } from '@reduxjs/toolkit';

const cookies = new Cookies();

const INITIAL_STATE = {
  activate_license: {
    data: null,
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
  active_licenses: {
    data: [],
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
  archived_licenses: {
    data: [],
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
  auth: {
    data: null,
    type: 'signin',
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
  de_activate: {
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
  de_activate_license: {
    data: null,
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
  delete_license: {
    data: null,
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
  delete_account: {
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
  logged_in: undefined,
  my_datasets: {
    data: [],
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
  update_account: {
    data: null,
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
  update_license: {
    // create or update
    data: null,
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
  pending_licenses: {
    data: [],
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
  premium_download: {
    data: null,
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
  update_password: {
    data: null,
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
  vendor_settings: {
    data: {},
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
  my_purchases: {
    data: [],
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
  purchase_details: {
    data: {},
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
};

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState: INITIAL_STATE,
  reducers: {
    initializeState: (state, { payload }) => {
      if (payload) {
        const { key } = payload;
        state[key] = INITIAL_STATE[key];
      } else return INITIAL_STATE;
    },
    logout: (state) => {
      cookies.remove('token');
      cookies.remove('account');
      state.logged_in = false;
      state.auth = { ...INITIAL_STATE.auth };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUserApiReq.pending, (state, { meta }) => {
        state.auth.status = { ...INITIAL_STATE.auth.status };
        state.auth.status.loading = true;
        state.auth.type = meta.arg?.type;
      })
      .addCase(authenticateUserApiReq.rejected, (state, { error, payload }) => {
        state.auth.status.loading = false;
        state.auth.status.error = true;
        state.auth.status.message = payload || error.message;
        state.auth.type = 'signin';
      })
      .addCase(authenticateUserApiReq.fulfilled, (state, { payload }) => {
        state.auth.status.loading = false;
        state.auth.status.ok = true;
        state.auth.data = payload;
        state.logged_in = payload?.id ? true : false;
      })
      .addCase(updateAccountApiReq.pending, (state) => {
        state.update_account.status = {
          ...INITIAL_STATE.update_account.status,
        };
        state.update_account.status.loading = true;
      })
      .addCase(updateAccountApiReq.rejected, (state, { error, payload }) => {
        state.update_account.status.loading = false;
        state.update_account.status.error = true;
        state.update_account.status.message = payload || error.message;
      })
      .addCase(updateAccountApiReq.fulfilled, (state, { payload }) => {
        state.update_account.status.loading = false;
        state.update_account.status.ok = true;
        state.update_account.data = payload;
      })
      .addCase(updateAccountPasswordApiReq.pending, (state) => {
        state.update_password.status = {
          ...INITIAL_STATE.update_password.status,
        };
        state.update_password.status.loading = true;
      })
      .addCase(
        updateAccountPasswordApiReq.rejected,
        (state, { error, payload }) => {
          state.update_password.status.loading = false;
          state.update_password.status.error = true;
          state.update_password.status.message = payload || error.message;
        }
      )
      .addCase(updateAccountPasswordApiReq.fulfilled, (state, { payload }) => {
        state.update_password.status.loading = false;
        state.update_password.status.ok = true;
        state.update_password.data = payload;
      })
      .addCase(myDatasetsApiReq.pending, (state) => {
        state.my_datasets.status = {
          ...INITIAL_STATE.my_datasets.status,
        };
        state.my_datasets.status.loading = true;
      })
      .addCase(myDatasetsApiReq.rejected, (state, { error, payload }) => {
        state.my_datasets.status.loading = false;
        state.my_datasets.status.error = true;
        state.my_datasets.status.message = payload || error.message;
      })
      .addCase(myDatasetsApiReq.fulfilled, (state, { payload }) => {
        state.my_datasets.status.loading = false;
        state.my_datasets.status.ok = true;
        state.my_datasets.data = payload.data;
      })
      .addCase(deActivateAccountApiReq.pending, (state) => {
        state.de_activate.status = {
          ...INITIAL_STATE.de_activate.status,
        };
        state.de_activate.status.loading = true;
      })
      .addCase(
        deActivateAccountApiReq.rejected,
        (state, { error, payload }) => {
          state.de_activate.status.loading = false;
          state.de_activate.status.error = true;
          state.de_activate.status.message = payload || error.message;
        }
      )
      .addCase(deActivateAccountApiReq.fulfilled, (state) => {
        state.de_activate.status.loading = false;
        state.de_activate.status.ok = true;
      })
      .addCase(vendorApiReq.pending, (state) => {
        state.vendor_settings.status = {
          ...INITIAL_STATE.vendor_settings.status,
        };
        state.vendor_settings.status.loading = true;
      })
      .addCase(vendorApiReq.rejected, (state, { error, payload }) => {
        state.vendor_settings.status.loading = false;
        state.vendor_settings.status.error = true;
        state.vendor_settings.status.message = payload || error.message;
      })
      .addCase(vendorApiReq.fulfilled, (state, { payload }) => {
        state.vendor_settings.status.loading = false;
        state.vendor_settings.status.ok = true;
        state.vendor_settings.data = payload?.data;
      })
      .addCase(licenseActivationApiReq.pending, (state) => {
        state.activate_license.status = {
          ...INITIAL_STATE.activate_license.status,
        };
        state.activate_license.status.loading = true;
      })
      .addCase(
        licenseActivationApiReq.rejected,
        (state, { error, payload }) => {
          state.activate_license.status.loading = false;
          state.activate_license.status.error = true;
          state.activate_license.status.message = payload || error.message;
        }
      )
      .addCase(licenseActivationApiReq.fulfilled, (state, { payload }) => {
        state.activate_license.status.loading = false;
        state.activate_license.status.ok = true;
        state.activate_license.data = payload?.data;
      })
      .addCase(licenseDeactivationApiReq.pending, (state) => {
        state.de_activate_license.status = {
          ...INITIAL_STATE.de_activate_license.status,
        };
        state.de_activate_license.status.loading = true;
      })
      .addCase(
        licenseDeactivationApiReq.rejected,
        (state, { error, payload }) => {
          state.de_activate_license.status.loading = false;
          state.de_activate_license.status.error = true;
          state.de_activate_license.status.message = payload || error.message;
        }
      )
      .addCase(licenseDeactivationApiReq.fulfilled, (state, { payload }) => {
        state.de_activate_license.status.loading = false;
        state.de_activate_license.status.ok = true;
        state.de_activate_license.data = payload?.data;
      })
      .addCase(licenseDeleteApiReq.pending, (state) => {
        state.delete_license.status = {
          ...INITIAL_STATE.delete_license.status,
        };
        state.delete_license.status.loading = true;
      })
      .addCase(licenseDeleteApiReq.rejected, (state, { error, payload }) => {
        state.delete_license.status.loading = false;
        state.delete_license.status.error = true;
        state.delete_license.status.message = payload || error.message;
      })
      .addCase(licenseDeleteApiReq.fulfilled, (state, { payload }) => {
        state.delete_license.status.loading = false;
        state.delete_license.status.ok = true;
        state.delete_license.data = payload?.data;
      })
      .addCase(licenseApiReq.pending, (state) => {
        state.update_license.status = {
          ...INITIAL_STATE.update_license.status,
        };
        state.update_license.status.loading = true;
      })
      .addCase(licenseApiReq.rejected, (state, { error, payload }) => {
        state.update_license.status.loading = false;
        state.update_license.status.error = true;
        state.update_license.status.message = payload || error.message;
      })
      .addCase(licenseApiReq.fulfilled, (state, { payload }) => {
        state.update_license.status.loading = false;
        state.update_license.status.ok = true;
        state.update_license.data = payload?.data;
      })
      .addCase(licensesApiReq.pending, (state, { meta }) => {
        if (meta.arg?.type === 'active') {
          state.active_licenses.status = {
            ...INITIAL_STATE.active_licenses.status,
          };
          state.active_licenses.status.loading = true;
        } else if (meta.arg?.type === 'archived') {
          state.archived_licenses.status = {
            ...INITIAL_STATE.archived_licenses.status,
          };
          state.archived_licenses.status.loading = true;
        }
      })
      .addCase(licensesApiReq.rejected, (state, { meta, error, payload }) => {
        if (meta.arg?.type === 'active') {
          state.active_licenses.status.loading = false;
          state.active_licenses.status.error = true;
          state.active_licenses.status.message = payload || error.message;
        } else if (meta.arg?.type === 'archived') {
          state.archived_licenses.status.loading = false;
          state.archived_licenses.status.error = true;
          state.archived_licenses.status.message = payload || error.message;
        }
      })
      .addCase(licensesApiReq.fulfilled, (state, { meta, payload }) => {
        if (meta.arg?.type === 'active') {
          state.active_licenses.status.loading = false;
          state.active_licenses.status.ok = true;
          state.active_licenses.data = payload?.data;
        } else if (meta.arg?.type === 'archived') {
          state.archived_licenses.status.loading = false;
          state.archived_licenses.status.ok = true;
          state.archived_licenses.data = payload?.data;
        }
      })
      .addCase(pendingLicensesApiReq.pending, (state) => {
        state.pending_licenses.status = {
          ...INITIAL_STATE.pending_licenses.status,
        };
        state.pending_licenses.status.loading = true;
      })
      .addCase(pendingLicensesApiReq.rejected, (state, { error, payload }) => {
        state.pending_licenses.status.loading = false;
        state.pending_licenses.status.error = true;
        state.pending_licenses.status.message = payload || error.message;
      })
      .addCase(pendingLicensesApiReq.fulfilled, (state, { payload }) => {
        state.pending_licenses.status.loading = false;
        state.pending_licenses.status.ok = true;
        state.pending_licenses.data = payload?.data;
      })
      .addCase(downloadPremiumApiReq.pending, (state) => {
        state.premium_download.status = {
          ...INITIAL_STATE.premium_download.status,
        };
        state.premium_download.status.loading = true;
      })
      .addCase(downloadPremiumApiReq.rejected, (state, { error, payload }) => {
        state.premium_download.status.loading = false;
        state.premium_download.status.error = true;
        state.premium_download.status.message = payload || error.message;
      })
      .addCase(downloadPremiumApiReq.fulfilled, (state, { payload }) => {
        state.premium_download.status.loading = false;
        state.premium_download.status.ok = true;
        state.premium_download.data = payload?.data;
      })
      .addCase(deleteAccountApiReq.pending, (state) => {
        state.delete_account.status = {
          ...INITIAL_STATE.delete_account.status,
        };
        state.delete_account.status.loading = true;
      })
      .addCase(deleteAccountApiReq.rejected, (state, { error, payload }) => {
        state.delete_account.status.loading = false;
        state.delete_account.status.error = true;
        state.delete_account.status.message = payload || error.message;
      })
      .addCase(deleteAccountApiReq.fulfilled, (state, { payload }) => {
        state.delete_account.status.loading = false;
        state.delete_account.status.ok = true;
      })
      .addCase(myPurchasesApiReq.pending, (state) => {
        state.my_purchases.status = {
          ...INITIAL_STATE.my_purchases.status,
        };
        state.my_purchases.status.loading = true;
      })
      .addCase(myPurchasesApiReq.rejected, (state, { error, payload }) => {
        state.my_purchases.status.loading = false;
        state.my_purchases.status.error = true;
        state.my_purchases.status.message = payload || error.message;
      })
      .addCase(myPurchasesApiReq.fulfilled, (state, { payload }) => {
        state.my_purchases.status.loading = false;
        state.my_purchases.status.ok = true;
        state.my_purchases.data = payload?.data;
      })
      .addCase(purchaseDetailsApiReq.pending, (state) => {
        state.purchase_details.status = {
          ...INITIAL_STATE.purchase_details.status,
        };
        state.purchase_details.status.loading = true;
      })
      .addCase(purchaseDetailsApiReq.rejected, (state, { error, payload }) => {
        state.purchase_details.status.loading = false;
        state.purchase_details.status.error = true;
        state.purchase_details.status.message = payload || error.message;
      })
      .addCase(purchaseDetailsApiReq.fulfilled, (state, { payload }) => {
        state.purchase_details.status.loading = false;
        state.purchase_details.status.ok = true;
        state.purchase_details.data = payload?.data;
      });
  },
});

export default authenticationSlice;
