import { configureStore } from '@reduxjs/toolkit';

// slices
import accountReducer from './account/accountSlice';
import walletReducer from './wallet/walletSlice';
import tableReducer from './table/tableSlice';

export default configureStore({
  reducer: {
    account: accountReducer,
    wallet: walletReducer,
    table: tableReducer,
  },
});
