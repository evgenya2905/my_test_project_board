import { Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { DropIndicator } from './DropIndicator';

export const CardIssue = ({ title, id, column, handleDragStart }: any) => {
  return (
    <>
      {<DropIndicator beforeId={id} column={column} />}
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) =>
          handleDragStart(e as unknown as React.DragEvent<HTMLDivElement>, {
            title,
            id,
            column,
          })
        }
      >
        <Card style={{ height: '5rem', width: '10rem' }}>
          <Card.Body>
            <Card.Title style={{ fontSize: '0.5rem' }}>{title}</Card.Title>
          </Card.Body>
        </Card>
      </motion.div>
    </>
  );
};
