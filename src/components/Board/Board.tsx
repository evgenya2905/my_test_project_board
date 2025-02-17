import { useState, useRef, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  useLazyGetRepoStarsQuery,
} from '../../store/issuesApi';
import { addRepo, updateRepoIssues } from '../../store/changeRepoSlice';
import { ContainerIssues } from '..';
import { RootState } from '../../store/store';
import { IEndpointParameter, INewIssues, IRepo } from '../../types';

export const Board = () => {
  const [getToDoIssues, { data: toDoIssues, isLoading: isLoadingToDo }] =
    useLazyGetToDoIssuesQuery();
  const [
    getInProgressIssues,
    { data: inProgressIssues, isLoading: isLoadingInProgress },
  ] = useLazyGetInProgressIssuesQuery();
  const [getDoneIssues, { data: doneIssues, isLoading: isLoadingDone }] =
    useLazyGetDoneIssuesQuery();
  const [getStars, { data: stars }] = useLazyGetRepoStarsQuery();

  const [issues, setIssues] = useState<INewIssues[]>([]);
  const [numberStars, setNumberStars] = useState(0);
  const [repoData, setRepoData] = useState<IEndpointParameter | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
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
      setNumberStars(currentRepoIssues[0].stars);
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const url = inputRef.current?.value;

    if (url) {
      const parsedRepoData = parseRepoUrl(url);

      if (parsedRepoData) {
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
      getToDoIssues({ owner: repoData.owner, repo: repoData.repo });
      getInProgressIssues({ owner: repoData.owner, repo: repoData.repo });
      getDoneIssues({ owner: repoData.owner, repo: repoData.repo });
      getStars({ owner: repoData.owner, repo: repoData.repo });
    }
  }, [repoData?.owner, repoData?.repo, currentRepoIssues.length]);

  useEffect(() => {
    if (
      !isLoadingToDo &&
      !isLoadingInProgress &&
      !isLoadingDone &&
      toDoIssues &&
      inProgressIssues &&
      doneIssues &&
      stars
    ) {
      const newIssues: INewIssues[] = [
        ...toDoIssues.map((issue) => ({
          title: issue.title,
          id: issue.id,
          column: 'todo',
          comments: issue.comments,
          admin: issue.user.login,
          number: issue.number,
          dataCreated: issue.created_at,
          stars: stars.stargazers_count,
        })),
        ...inProgressIssues.map((issue) => ({
          title: issue.title,
          id: issue.id,
          column: 'inProgress',
          comments: issue.comments,
          admin: issue.user.login,
          number: issue.number,
          dataCreated: issue.created_at,
          stars: stars.stargazers_count,
        })),
        ...doneIssues.map((issue) => ({
          title: issue.title,
          id: issue.id,
          column: 'done',
          comments: issue.comments,
          admin: issue.user.login,
          number: issue.number,
          dataCreated: issue.created_at,
          stars: stars.stargazers_count,
        })),
      ];

      const newRepo: IRepo = {
        id: `${repoData?.repo}+${repoData?.owner}`,
        repo: repoData?.repo,
        owner: repoData?.owner,
        issues: [],
      };

      dispatch(addRepo(newRepo));
      setIssues(newIssues);
      setNumberStars(newIssues[0]?.stars);

      dispatch(
        updateRepoIssues({
          id: `${repoData?.repo}+${repoData?.owner}`,
          issues: newIssues,
        })
      );
    }
  }, [
    JSON.stringify(toDoIssues),
    JSON.stringify(inProgressIssues),
    JSON.stringify(doneIssues),
  ]);

  return (
    <>
      <Form
        style={{ marginRight: '7rem', marginLeft: '7rem', marginTop: '0.5rem' }}
        onSubmit={handleSubmit}
        data-testid="form"
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
      <Card.Body
        style={{
          marginLeft: '7rem',
          marginTop: '1rem',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'anchor-center',
        }}
      >
        <Card.Link
          style={{ color: '#247d97' }}
          target="_blank"
          href={repoData ? `https://github.com/${repoData.owner}/` : '#'}
        >
          {repoData ? repoData.owner : 'owner'}
        </Card.Link>
        {' > '}
        <Card.Link
          style={{ color: '#247d97' }}
          target="_blank"
          href={
            repoData
              ? `https://github.com/${repoData.owner}/${repoData.repo}`
              : '#'
          }
        >
          {repoData ? repoData.repo : 'repo'}
        </Card.Link>
        <Card.Text
          style={{
            display: 'flex',
            gap: '0.7rem',
            marginLeft: '2rem',
            alignItems: 'anchor-center',
          }}
        >
          <img
            alt="star_icon"
            src="../public/star.png"
            style={{ width: '1.5rem', marginTop: '0' }}
          />
          {(numberStars &&
            (numberStars > 1000
              ? `${Math.floor(numberStars / 1000)} K`
              : numberStars)) ||
            0}{' '}
          stars
        </Card.Text>
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
              isLoading={isLoadingToDo}
            />
          </Col>
          <Col>
            <ContainerIssues
              title="In Progress"
              column="inProgress"
              issues={issues}
              setIssues={setIssues}
              paramsUrl={repoData}
              isLoading={isLoadingInProgress}
            />
          </Col>
          <Col>
            <ContainerIssues
              title="Done"
              column="done"
              issues={issues}
              setIssues={setIssues}
              paramsUrl={repoData}
              isLoading={isLoadingDone}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};
