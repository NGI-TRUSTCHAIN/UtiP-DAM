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

import datasetSlice from './reducer';
import { datasetState } from './selectors';

const { actions, reducer } = datasetSlice;

export const datasetActions = {
  ...actions,
  checkoutApiReq,
  datasetsApiReq,
  datasetUpdateApiReq,
  datasetDeleteApiReq,
  datasetGetApiReq,
  datasetPutApiReq,
  emailSendApiReq,
  getDatasetLocationsApiReq,
  mobilityDatasetDownloadApiReq,
};

export { datasetState };

export default reducer;
