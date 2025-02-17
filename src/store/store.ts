import { configureStore } from '@reduxjs/toolkit';
import { issuesApi } from './issuesApi';
import changeRepoReducer from './changeRepoSlice';

export const store = configureStore({
  reducer: {
    [issuesApi.reducerPath]: issuesApi.reducer,
    repoList: changeRepoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(issuesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
