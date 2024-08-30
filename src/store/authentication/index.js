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

import authenticationSlice from './reducer';
import { authenticationState } from './selectors';

const { actions, reducer } = authenticationSlice;

export const authenticationActions = {
  ...actions,
  authenticateUserApiReq,
  myDatasetsApiReq,
  updateAccountApiReq,
  updateAccountPasswordApiReq,
  deActivateAccountApiReq,
  vendorApiReq,
  deleteAccountApiReq,
  downloadPremiumApiReq,
  licenseActivationApiReq,
  licenseApiReq,
  licenseDeactivationApiReq,
  licenseDeleteApiReq,
  licensesApiReq,
  pendingLicensesApiReq,
  myPurchasesApiReq,
  purchaseDetailsApiReq,
};

export { authenticationState };
export default reducer;
