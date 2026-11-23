import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: null,
  type: 'success', // 'success' | 'info' | 'warning' | 'error'
  id: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type || 'success';
      state.id = Date.now();
    },
    clearNotification: (state) => {
      state.message = null;
      state.id = null;
    },
  },
});

export const { showNotification, clearNotification } = notificationSlice.actions;

export const selectNotification = (state) => state.notification;

export default notificationSlice.reducer;
