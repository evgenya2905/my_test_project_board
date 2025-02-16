import { ContainerIssues } from './ContainerIssues';
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Card,
} from 'react-bootstrap';
import {
  useLazyGetToDoIssuesQuery,
  useLazyGetInProgressIssuesQuery,
  useLazyGetDoneIssuesQuery,
} from './store/issuesApi';
import { useState, useRef, useEffect, useMemo } from 'react';
import { IEndpointParameter, IIssue } from './types';
import { useSelector, useDispatch } from 'react-redux';
import { addRepo, updateRepoIssues } from './store/changeRepoSlice';
import { RootState } from './store/store';

export const Board = () => {
  const [getToDoIssues, { data: toDoIssues, isLoading: a }] =
    useLazyGetToDoIssuesQuery();
  const [getInProgressIssues, { data: inProgressIssues, isLoading: b }] =
    useLazyGetInProgressIssuesQuery();
  const [getDoneIssues, { data: doneIssues, isLoading: c }] =
    useLazyGetDoneIssuesQuery();
  const [issues, setIssues] = useState<IIssue[]>([]);

  const dispatch = useDispatch();
  const [repoData, setRepoData] = useState<IEndpointParameter | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const dataStorage = useSelector((state: RootState) => state.repoList.value);
  const currentRepoIssues = useMemo(() => {
    return (
      dataStorage.find(
        (repo) => repo.id === `${repoData?.repo}+${repoData?.owner}`
      )?.issues || []
    );
  }, [repoData?.repo, repoData?.owner]);

  useEffect(() => {
    if (currentRepoIssues.length > 0) {
      setIssues(currentRepoIssues);
    }
  }, [currentRepoIssues]);

  const parseRepoUrl = (url: string) => {
    const regex: RegExp = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
    const match = url.match(regex);

    if (match) {
      return {
        owner: match[1],
        repo: match[2],
      };
    }

    return null;
  };
  const handleSubmit = (e: any) => {
    /*    setIssues([]); */
    e.preventDefault();

    const url = inputRef.current?.value;

    if (url) {
      const parsedRepoData = parseRepoUrl(url);

      if (parsedRepoData) {
        /*  const newRepo = {
          id: `${parsedRepoData.repo}+${parsedRepoData.owner}`,
          name: parsedRepoData.repo,
          owner: parsedRepoData.owner,
          issues: [],
        };

        dispatch(addRepo(newRepo)); */
        setRepoData(parsedRepoData);
      } else {
        alert('incorrect url');
      }

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  useEffect(() => {
    if (repoData?.owner && repoData?.repo && currentRepoIssues.length === 0) {
      /*  setIssues([]); */
      getToDoIssues({ owner: repoData.owner, repo: repoData.repo });
      getInProgressIssues({ owner: repoData.owner, repo: repoData.repo });
      getDoneIssues({ owner: repoData.owner, repo: repoData.repo });
    }
  }, [repoData?.owner, repoData?.repo, currentRepoIssues.length]);

  useEffect(() => {
    if (
      !a &&
      !b &&
      !c &&
      repoData?.owner &&
      repoData?.repo &&
      toDoIssues &&
      inProgressIssues &&
      doneIssues &&
      currentRepoIssues.length === 0
    ) {
      const newRepo = {
        id: `${repoData.repo}+${repoData.owner}`,
        name: repoData.repo,
        owner: repoData.owner,
        issues: [],
      };

      const newIssues = [
        ...toDoIssues.map((issue) => ({
          title: issue.title,
          id: issue.id,
          column: 'todo',
        })),
        ...inProgressIssues.map((issue) => ({
          title: issue.title,
          id: issue.id,
          column: 'inProgress',
        })),
        ...doneIssues.map((issue) => ({
          title: issue.title,
          id: issue.id,
          column: 'done',
        })),
      ];
      console.log('🚀 ~ useEffect ~ newIssues:', newIssues);

      dispatch(addRepo(newRepo));
      setIssues(newIssues);
      dispatch(
        updateRepoIssues({
          id: `${repoData.repo}+${repoData.owner}`,
          issues: newIssues,
        })
      );
    }
  }, [
    repoData?.repo,
    repoData?.owner,
    JSON.stringify(toDoIssues),
    JSON.stringify(inProgressIssues),
    JSON.stringify(doneIssues),
    currentRepoIssues.length,
  ]);

  return (
    <>
      <Form
        style={{ marginRight: '7rem', marginLeft: '7rem' }}
        onSubmit={handleSubmit}
      >
        <InputGroup>
          <Form.Control
            type="url"
            placeholder="Enter repo URL"
            name="repoUrl"
            ref={inputRef}
            required
          />
          <Button type="submit">Load issues</Button>
        </InputGroup>
      </Form>
      <Card.Body style={{ marginLeft: '7rem', marginTop: '1rem' }}>
        <Card.Link
          target="_blank"
          href={repoData ? `https://github.com/${repoData.owner}/` : '#'}
        >
          {repoData ? repoData.owner : 'owner'}
        </Card.Link>
        {' > '}
        <Card.Link
          target="_blank"
          href={
            repoData
              ? `https://github.com/${repoData.owner}/${repoData.repo}`
              : '#'
          }
        >
          {repoData ? repoData.repo : 'repo'}
        </Card.Link>
      </Card.Body>

      <Container>
        <Row>
          <Col>
            <ContainerIssues
              title="toDo"
              column="todo"
              issues={issues}
              setIssues={setIssues}
              paramsUrl={repoData}
              isLoading={a}
            />
          </Col>
          <Col>
            <ContainerIssues
              title="In Progress"
              column="inProgress"
              issues={issues}
              setIssues={setIssues}
              paramsUrl={repoData}
              isLoading={b}
            />
          </Col>
          <Col>
            <ContainerIssues
              title="Done"
              column="done"
              issues={issues}
              setIssues={setIssues}
              paramsUrl={repoData}
              isLoading={c}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};
