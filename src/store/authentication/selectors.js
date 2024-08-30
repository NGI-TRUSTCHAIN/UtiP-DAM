const authStatus = (state) => state.auth.auth.status;
const authData = (state) => state.auth.auth.data;
const authType = (state) => state.auth.auth.type;

const accountUpdateStatus = (state) => state.auth.update_account.status;
const accountUpdateData = (state) => state.auth.update_account.data;

const passwordUpdateStatus = (state) => state.auth.update_password.status;
const passwordUpdateData = (state) => state.auth.update_password.data;

const myDatasetsStatus = (state) => state.auth.my_datasets.status;
const myDatasetsData = (state) => state.auth.my_datasets.data;

const deActivateStatus = (state) => state.auth.de_activate.status;
const deleteAccountStatus = (state) => state.auth.delete_account.status;

const VendorSettingsData = (state) => state.auth.vendor_settings.data;
const VendorSettingsStatus = (state) => state.auth.vendor_settings.status;

const updateLicenseData = (state) => state.auth.update_license.data;
const updateLicenseStatus = (state) => state.auth.update_license.status;

const activateLicenseData = (state) => state.auth.activate_license.data;
const activateLicenseStatus = (state) => state.auth.activate_license.status;

const deactivateLicenseData = (state) => state.auth.de_activate_license.data;
const deactivateLicenseStatus = (state) =>
  state.auth.de_activate_license.status;

const deleteLicenseData = (state) => state.auth.delete_license.data;
const deleteLicenseStatus = (state) => state.auth.deactivate_license.status;

const activeLicensesData = (state) => state.auth.active_licenses.data;
const activeLicensesStatus = (state) => state.auth.active_licenses.status;

const archivedLicensesData = (state) => state.auth.archived_licenses.data;
const archivedLicensesStatus = (state) => state.auth.archived_licenses.status;

const pendingLicensesData = (state) => state.auth.pending_licenses.data;
const pendingLicensesStatus = (state) => state.auth.pending_licenses.status;

const premiumDownloadData = (state) => state.auth.premium_download.data;
const premiumDownloadStatus = (state) => state.auth.premium_download.status;

const myPurchasesData = (state) => state.auth.my_purchases.data;
const myPurchasesStatus = (state) => state.auth.my_purchases.status;

const purchaseDetailsData = (state) => state.auth.purchase_details.data;
const purchaseDetailsStatus = (state) => state.auth.purchase_details.status;

const loggedIn = (state) => state.auth.logged_in;

export const authenticationState = {
  authStatus,
  authData,
  authType,

  accountUpdateStatus,
  accountUpdateData,
  passwordUpdateStatus,
  passwordUpdateData,

  myDatasetsData,
  myDatasetsStatus,

  deActivateStatus,
  deleteAccountStatus,
  deleteLicenseData,
  deleteLicenseStatus,

  VendorSettingsData,
  VendorSettingsStatus,
  updateLicenseData,
  updateLicenseStatus,
  activateLicenseData,
  activateLicenseStatus,
  deactivateLicenseData,
  deactivateLicenseStatus,
  activeLicensesData,
  activeLicensesStatus,
  archivedLicensesData,
  archivedLicensesStatus,
  pendingLicensesData,
  pendingLicensesStatus,
  premiumDownloadData,
  premiumDownloadStatus,
  myPurchasesData,
  myPurchasesStatus,
  purchaseDetailsData,
  purchaseDetailsStatus,

  loggedIn,
};
