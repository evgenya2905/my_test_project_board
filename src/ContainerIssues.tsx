import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { CardIssue } from './CardIssue';
import { useEffect, useState } from 'react';
import { IContainerIssuesProps } from './types';
import { useDispatch } from 'react-redux';
import { updateRepoIssues } from './store/changeRepoSlice';
import { DropIndicator } from './DropIndicator';

export const ContainerIssues /* : React.FC<IContainerIssuesProps> */ = ({
  title,
  column,
  issues,
  setIssues,
  paramsUrl,
  isLoading,
}: any) => {
  const dispatch = useDispatch();
  const [active, setActive] = useState(false);
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, issue: any) => {
    e.dataTransfer.setData('issueId', issue.id);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const issueId = e.dataTransfer.getData('issueId');

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || '-1';

    if (before != issueId) {
      let copy = [...issues];

      let issueToTransfer = copy.find((i) => i.id == issueId);
      if (!issueToTransfer) return;
      issueToTransfer = { ...issueToTransfer, column };

      copy = copy.filter((i) => i.id != issueId);

      const moveToBack = before === '-1';

      if (moveToBack) {
        copy.push(issueToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id == before);
        if (insertAtIndex === -1) return;

        copy.splice(insertAtIndex, 0, issueToTransfer);
      }

      setIssues(copy);
      dispatch(
        updateRepoIssues({
          id: `${paramsUrl.repo}+${paramsUrl.owner}`,
          issues: copy,
        })
      );
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
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

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(`[data-column="${column}"]`)
    ) as HTMLElement[];
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredIssues = issues.filter((i: any) => i.column === column);
  return (
    <Container
      style={{ marginRight: '2rem', marginLeft: '2rem', marginTop: '2rem' }}
    >
      <Row>
        <Col style={{ textAlign: 'center', maxWidth: '20rem' }}>{title}</Col>
      </Row>

      <Row>
        <Col
          /*   xs="auto" */
          onDrop={handleDragEnd}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            backgroundColor: '#c0c9cc',
            width: '20rem',
            height: '30rem',
            textAlign: 'center',
            maxWidth: '20rem',
          }}
        >
          {isLoading ? (
            'Loading..'
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
