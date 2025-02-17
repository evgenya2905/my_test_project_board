import { IRepo } from '../types';

export const setRepoList = (repoList: IRepo[]) => {
  localStorage.setItem('repoList', JSON.stringify(repoList));
};

export const getRepoList = (): IRepo[] => {
  const repoList = localStorage.getItem('repoList');
  return repoList ? JSON.parse(repoList) : [];
};
