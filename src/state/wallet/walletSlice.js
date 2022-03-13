import { createSlice } from '@reduxjs/toolkit';

export const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    address: '',
  },
  reducers: {
    setWallet(state, action) {
      state.address = action.payload;
    },
  },
});

export const { setWallet } = walletSlice.actions;
export const walletState = (state) => state.wallet.address;

export default walletSlice.reducer;
