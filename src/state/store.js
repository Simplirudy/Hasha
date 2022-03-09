import { configureStore } from '@reduxjs/toolkit';

// slices
import accountReducer from './account/accountSlice';
import walletReducer from './wallet/walletSlice';

export default configureStore({
  reducer: {
    account: accountReducer,
    wallet: walletReducer,
  },
});
