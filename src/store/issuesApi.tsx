import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IIssue, IEndpointParameter } from '../types';

export const issuesApi = createApi({
  reducerPath: 'issuesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.github.com/repos',
  }),
  endpoints: (builder) => ({
    getToDoIssues: builder.query<IIssue[], IEndpointParameter>({
      query: ({ owner, repo }) => ({
        url: `/${owner}/${repo}/issues?state=open&per_page=5`,
      }),
    }),
    getInProgressIssues: builder.query<IIssue[], IEndpointParameter>({
      query: ({ owner, repo }) => ({
        url: `/${owner}/${repo}/issues?assignee=*&per_page=5`,
      }),
    }),
    getDoneIssues: builder.query<IIssue[], IEndpointParameter>({
      query: ({ owner, repo }) => ({
        url: `/${owner}/${repo}/issues?state=closed&per_page=5`,
      }),
    }),
  }),
});

export const {
  useLazyGetToDoIssuesQuery,
  useLazyGetInProgressIssuesQuery,
  useLazyGetDoneIssuesQuery,
} = issuesApi;
