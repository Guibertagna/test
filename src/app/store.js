import { configureStore } from '@reduxjs/toolkit';
import { numbersSlice } from '../ducks/numbersSlice';

const store = configureStore({
  reducer: {
    numbersSlice: numbersSlice.reducer
  },
});
window.store = store;

export default store;