import {
  mobilityAnonymizationApiReq,
  mobilityAuditApiReq,
  visitorDetectionApiReq,
} from './thunks';

import anonymizationSlice from './reducer';
import { anonymizationState } from './selectors';

const { actions, reducer } = anonymizationSlice;
export const anonymizationActions = {
  ...actions,
  mobilityAnonymizationApiReq,
  mobilityAuditApiReq,
  visitorDetectionApiReq,
};
export { anonymizationState };

export default reducer;
