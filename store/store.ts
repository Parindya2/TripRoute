// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './slices/favoritesSlice';
import authReducer from './slices/authSlice';
import transportReducer from './slices/transportSlice';
import destinationsReducer from './slices/destinationsSlice';
import nearby1Reducer from './slices/nearbySlice1';



export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    auth: authReducer,
    transport: transportReducer,
    destinations: destinationsReducer,
    nearby1: nearby1Reducer,
    
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;