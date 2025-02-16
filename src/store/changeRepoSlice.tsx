import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setRepoList, getRepoList } from './localStorageUtils';

type Issues = any[];

interface Repo {
  id: string;
  name: string;
  owner: string;
  issues: Issues;
}

const initialState = { value: getRepoList() || [] };

export const changeRepoSlice = createSlice({
  name: 'repoList',
  initialState,
  reducers: {
    addRepo: (state, action: PayloadAction<Repo>) => {
      const existingRepo = state.value.find((r) => r.id === action.payload.id);
      if (!existingRepo) {
        state.value.push(action.payload);
        setRepoList(state.value);
      }
    },
    updateRepoIssues: (
      state,
      action: PayloadAction<{ id: string; issues: Issues }>
    ) => {
      const repo = state.value.find((r) => r.id === action.payload.id);
      if (repo) {
        repo.issues = action.payload.issues;
        setRepoList(state.value);
      }
    },
  },
});

export const { addRepo, updateRepoIssues } = changeRepoSlice.actions;
export default changeRepoSlice.reducer;
