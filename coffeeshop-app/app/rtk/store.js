import { configureStore } from "@reduxjs/toolkit";
import { breweryApi } from './breweryApi';
import favoritesReducer from './favoritesSlice'

export const store = configureStore({
    reducer:{
        [breweryApi.reducerPath]:breweryApi.reducer, favorites: favoritesReducer},
    middleware:(getDefaultMiddleware) =>getDefaultMiddleware()
    .concat(breweryApi.middleware)
});

