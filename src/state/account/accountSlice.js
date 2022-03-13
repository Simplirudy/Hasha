import { createSlice } from '@reduxjs/toolkit';

export const accountSlice = createSlice({
  name: 'account',
  initialState: {
    account: null,
  },
  reducers: {
    setAccount(state, action) {
      state.account = action.payload;
    },
  },
});

export const { setAccount } = accountSlice.actions;
export const accountState = (state) => state.account.account;

export default accountSlice.reducer;
