import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { CardIssue } from './CardIssue';
import { useEffect } from 'react';
import { IContainerIssuesProps } from './types';

export const ContainerIssues: React.FC<IContainerIssuesProps> = ({
  title,
  paramsUrl,
  fetchIssues,
}) => {
  const [getIssues, { data: issues, isFetching }] = fetchIssues();

  useEffect(() => {
    if (paramsUrl?.owner && paramsUrl?.repo) {
      getIssues({ owner: paramsUrl.owner, repo: paramsUrl.repo });
    }
  }, [paramsUrl, getIssues]);

  console.log(issues);

  return (
    <Container>
      <Row>
        <Col>{title}</Col>
      </Row>

      <Row>
        <Col
          style={{
            backgroundColor: '#c0c9cc',
            width: '15rem',
            height: '30rem',
          }}
        >
          {isFetching && <Spinner animation="border" variant="primary" />}
          {!isFetching &&
            issues?.map((issue) => (
              <CardIssue key={issue.id} title={issue.title} />
            ))}
        </Col>
      </Row>
    </Container>
  );
};
