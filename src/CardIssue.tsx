import { Card } from 'react-bootstrap';

export const CardIssue = (props: any) => {
  return (
    <Card style={{ height: '5rem', width: '10rem' }}>
      <Card.Body>
        <Card.Title style={{ fontSize: '0.5rem' }}>{props.title}</Card.Title>
      </Card.Body>
    </Card>
  );
};
