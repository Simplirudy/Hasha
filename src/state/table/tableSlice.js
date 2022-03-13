import { createSlice } from '@reduxjs/toolkit';

export const tableSlice = createSlice({
  name: 'table',
  initialState: {
    // id: 'hasha_users_1_337',
    id: 'hasha_users_1_479',
  },
  reducers: {
    setTableId(state, action) {
      state.id = action.payload;
    },
  },
});

export const { setTableId } = tableSlice.actions;
export const tableState = (state) => state.table.id;

export default tableSlice.reducer;
