import globalSlice from './reducer';
import { globalState } from './selectors';

const { actions, reducer } = globalSlice;
export const globalActions = {
  ...actions,
};
export { globalState };

export default reducer;
