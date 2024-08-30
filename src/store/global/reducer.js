import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = {
  app: {
    toasters: [],
    status: {
      loading: false,
      error: false,
      ok: false,
      message: null,
    },
  },
};

const globalSlice = createSlice({
  name: 'global',
  initialState: INITIAL_STATE,
  reducers: {
    setToaster: (state, { payload }) => {
      state.app.toasters = [...state.app.toasters, payload];
    },
  },
});

export default globalSlice;
