import { Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { DropIndicator } from '..';
import { INewIssues } from '../../types';

interface ICardIssueProps extends INewIssues {
  handleDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    issue: { title: string; id: number; column: string }
  ) => void;
}

export const CardIssue: React.FC<ICardIssueProps> = ({
  title,
  id,
  column,
  comments,
  admin,
  number,
  dataCreated,
  handleDragStart,
}) => {
  const date = Date.parse(dataCreated);
  const dateNow = Date.now();
  const dateDifference = dateNow - date;
  const days = Math.floor(dateDifference / (1000 * 60 * 60 * 24));

  return (
    <>
      {<DropIndicator beforeId={String(id)} column={column} />}
      <motion.div
        layout
        layoutId={String(id)}
        draggable="true"
        onDragStart={(e) =>
          handleDragStart(e as unknown as React.DragEvent<HTMLDivElement>, {
            title,
            id,
            column,
          })
        }
      >
        <Card style={{ height: '5rem', width: '18rem', cursor: 'grab' }}>
          <Card.Body>
            <Card.Title
              style={{
                fontSize: '0.9rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                margin: '0',
              }}
            >
              {title}
            </Card.Title>
            <Card.Text
              style={{
                fontSize: '0.7rem',
                marginTop: '0.1rem',
                marginBottom: '0.1rem',
              }}
            >
              #{number} opened {days} days ago
            </Card.Text>
            <Card.Text
              style={{
                fontSize: '0.7rem',
                marginTop: '0.1rem',
                marginBottom: '0.1rem',
              }}
            >
              {admin} | Comments: {comments}
            </Card.Text>
          </Card.Body>
        </Card>
      </motion.div>
    </>
  );
};
