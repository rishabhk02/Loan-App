import { configureStore } from '@reduxjs/toolkit';
import loanSlice from '../features/loanSlice';
import profileSlice from '../features/profileSlice';

const store = configureStore({
    reducer: {
        profile: profileSlice,
        loan: loanSlice,
    },
});

export default store;