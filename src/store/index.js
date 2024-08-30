import anonymizationSlice from './anonymization/reducer';
import authenticationSlice from './authentication/reducer';
import { configureStore } from '@reduxjs/toolkit';
import datasetSlice from './dataset/reducer';
import globalSlice from './global/reducer';

export const store = configureStore({
  reducer: {
    auth: authenticationSlice.reducer,
    anonymization: anonymizationSlice.reducer,
    dataset: datasetSlice.reducer,
    global: globalSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
