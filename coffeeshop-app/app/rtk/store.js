import { configureStore } from "@reduxjs/toolkit";
import { breweryApi } from './breweryApi';
import favoritesReducer from './favoritesSlice'
import userShopsReducer from './userShopsSlice'

export const store = configureStore({
    reducer:{
        [breweryApi.reducerPath]:breweryApi.reducer, 
        favorites: favoritesReducer,
        userShops: userShopsReducer
    },
    middleware:(getDefaultMiddleware) =>getDefaultMiddleware()
    .concat(breweryApi.middleware)
});

