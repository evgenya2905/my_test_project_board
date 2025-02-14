import { ContainerIssues } from './ContainerIssues';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import {
  useLazyGetToDoIssuesQuery,
  useLazyGetInProgressIssuesQuery,
  useLazyGetDoneIssuesQuery,
} from './store/issuesApi';
import { useState, useRef } from 'react';
import { IEndpointParameter } from './types';

export const Board = () => {
  const [repoData, setRepoData] = useState<IEndpointParameter | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const columns = [
    {
      id: 1,
      title: 'ToDo',
      paramsUrl: repoData,
      fetchIssues: useLazyGetToDoIssuesQuery,
    },
    {
      id: 2,
      title: 'In Progress',
      paramsUrl: repoData,
      fetchIssues: useLazyGetInProgressIssuesQuery,
    },
    {
      id: 3,
      title: 'Done',
      paramsUrl: repoData,
      fetchIssues: useLazyGetDoneIssuesQuery,
    },
  ];

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Form.Control
            type="url"
            placeholder="Enter repo URL"
            name="repoUrl"
            ref={inputRef}
            required
          />
          <Button type="submit">Loads</Button>
        </InputGroup>
      </Form>
      <Container>
        <Row>
          {columns.map((column) => (
            <Col key={column.id}>
              <ContainerIssues
                title={column.title}
                paramsUrl={column.paramsUrl}
                fetchIssues={column.fetchIssues}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};
