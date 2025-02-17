export interface IEndpointParameter {
  owner: string | undefined;
  repo: string | undefined;
}

export interface IIssueResponse {
  id: number;
  title: string;
  comments: number;
  user: {
    login: string;
  };
  number: number;
  created_at: string;
  stars: number;
}

export interface INewIssues {
  title: string;
  id: number;
  column: string;
  comments: number;
  admin: string;
  number: number;
  dataCreated: string;
  stars: number;
}

export interface IRepo extends IEndpointParameter {
  id: string;
  issues: INewIssues[];
}

export interface IContainerIssuesProps {
  title: string;
  column: string;
  issues: INewIssues[];
  setIssues: React.Dispatch<React.SetStateAction<INewIssues[]>>;
  paramsUrl: IEndpointParameter | null;
  isLoading: boolean;
}
