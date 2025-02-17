import { useDispatch } from 'react-redux';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { updateRepoIssues } from '../../store/changeRepoSlice';

import { IContainerIssuesProps } from '../../types';
import { CardIssue, DropIndicator } from '..';

export const ContainerIssues: React.FC<IContainerIssuesProps> = ({
  title,
  column,
  issues,
  setIssues,
  paramsUrl,
  isLoading,
}) => {
  const dispatch = useDispatch();
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    issue: { title: string; id: number; column: string }
  ) => {
    e.dataTransfer.setData('issueId', String(issue.id));
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const issueId = e.dataTransfer.getData('issueId');

    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || '-1';

    if (before != issueId) {
      let copy = [...issues];

      let issueToTransfer = copy.find((i) => String(i.id) === issueId);
      if (!issueToTransfer) return;
      issueToTransfer = { ...issueToTransfer, column };

      copy = copy.filter((i) => String(i.id) !== issueId);

      const moveToBack = before === '-1';

      if (moveToBack) {
        copy.push(issueToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => String(el.id) === before);
        if (insertAtIndex === -1) return;

        copy.splice(insertAtIndex, 0, issueToTransfer);
      }

      setIssues(copy);
      dispatch(
        updateRepoIssues({
          id: `${paramsUrl?.repo}+${paramsUrl?.owner}`,
          issues: copy,
        })
      );
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    highlightIndicator(e);
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();
    indicators.forEach((i) => (i.style.opacity = '0'));
  };

  const highlightIndicator = (e: React.DragEvent<HTMLDivElement>) => {
    const indicators = getIndicators();
    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = '1';
  };

  const getNearestIndicator = (
    e: React.DragEvent<HTMLDivElement>,
    indicators: HTMLElement[]
  ) => {
    const DISTANCE_OFFSET = 50;

    return indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        return offset < 0 && offset > closest.offset
          ? { offset, element: child }
          : closest;
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );
  };

  const getIndicators = (): HTMLElement[] => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };

  const handleDragLeave = () => {
    clearHighlights();
  };

  const filteredIssues = issues.filter((i: any) => i.column === column);
  return (
    <Container
      style={{
        marginRight: '2rem',
        marginLeft: '2rem',
        marginTop: '0.5rem',
      }}
    >
      <Row>
        <Col
          style={{
            textAlign: 'center',
            maxWidth: '20rem',
            fontSize: '1rem',
          }}
        >
          {title}
        </Col>
      </Row>

      <Row>
        <Col
          onDrop={handleDragEnd}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            backgroundColor: '#c0c9cc',
            width: '20rem',
            height: '35rem',
            marginTop: '0.5rem',

            maxWidth: '20rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {isLoading ? (
            <Spinner
              animation="border"
              variant="light"
              style={{ marginTop: '2rem' }}
              data-testid="spinner"
            />
          ) : (
            <>
              {filteredIssues.map((i): any => (
                <CardIssue
                  key={i.id}
                  {...i}
                  handleDragStart={handleDragStart}
                />
              ))}
              <DropIndicator beforeId={null} column={column} />
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};
