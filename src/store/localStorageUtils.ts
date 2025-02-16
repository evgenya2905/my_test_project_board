interface Repo {
  id: string;
  name: string;
  owner: string;
  issues: Issues;
}
type Issues = any[]; /* {
  todo: any[];
  inProgress: any[];
  done: any[];
} */
export const setRepoList = (repoList: Repo[]) => {
  localStorage.setItem('repoList', JSON.stringify(repoList));
};

export const getRepoList = (): Repo[] => {
  const repoList = localStorage.getItem('repoList');
  return repoList ? JSON.parse(repoList) : [];
};
