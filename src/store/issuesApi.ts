import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IIssueResponse, IEndpointParameter } from '../types';

export const issuesApi = createApi({
  reducerPath: 'issuesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.github.com/repos',
  }),
  endpoints: (builder) => ({
    getToDoIssues: builder.query<IIssueResponse[], IEndpointParameter>({
      query: ({ owner, repo }) => ({
        url: `/${owner}/${repo}/issues?state=open&per_page=4`,
      }),
    }),
    getInProgressIssues: builder.query<IIssueResponse[], IEndpointParameter>({
      query: ({ owner, repo }) => ({
        url: `/${owner}/${repo}/issues?assignee=*&per_page=4`,
      }),
    }),
    getDoneIssues: builder.query<IIssueResponse[], IEndpointParameter>({
      query: ({ owner, repo }) => ({
        url: `/${owner}/${repo}/issues?state=closed&per_page=4`,
      }),
    }),
    getRepoStars: builder.query<
      { stargazers_count: number },
      IEndpointParameter
    >({
      query: ({ owner, repo }) => ({
        url: `/${owner}/${repo}`,
      }),
    }),
  }),
});

export const {
  useLazyGetToDoIssuesQuery,
  useLazyGetInProgressIssuesQuery,
  useLazyGetDoneIssuesQuery,
  useLazyGetRepoStarsQuery,
} = issuesApi;
