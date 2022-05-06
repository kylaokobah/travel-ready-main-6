import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import countryReducer from './country';
import covidReducer from './covid';
import backdropReducer from './backdrop';
import travelHistoryReducer from './travelHistory';
import placesSearchReducer from './placesSearch';

export const store = configureStore({
    reducer: {
        user: userReducer,
        country: countryReducer,
        covid: covidReducer,
        backdrop: backdropReducer,
        travelHistory: travelHistoryReducer,
        placesSearch: placesSearchReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
    devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;