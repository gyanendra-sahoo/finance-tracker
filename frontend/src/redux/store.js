import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './slices/modalSlice.js';


const store = configureStore({
    reducer: {
        modal: modalReducer
    }
});

export { store };