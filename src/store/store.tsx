import { configureStore } from '@reduxjs/toolkit';
import { issuesApi } from './issuesApi';

export const store = configureStore({
  reducer: {
    [issuesApi.reducerPath]: issuesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(issuesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
