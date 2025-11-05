import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import leadSlice from './slices/leadSlice';
import employeeSlice from './slices/employeeSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    leads: leadSlice,
    employees: employeeSlice,
  },
});

export default store;