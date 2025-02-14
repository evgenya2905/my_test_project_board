import { issuesApi } from './store/issuesApi';

export interface IIssue {
  id?: number;
  title?: string;
}

export interface IEndpointParameter {
  owner: string;
  repo: string;
}

export type FetchIssuesType = typeof issuesApi.useLazyGetToDoIssuesQuery;

export interface IContainerIssuesProps {
  title: string;
  paramsUrl: IEndpointParameter | null;
  fetchIssues: FetchIssuesType;
}
