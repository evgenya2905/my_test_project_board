import { render, screen, fireEvent } from '@testing-library/react';
import { CardIssue } from './CardIssue';
import { INewIssues } from '../../types';
import { vi, describe, test, expect } from 'vitest';

const mockHandleDragStart = vi.fn();

const mockIssue: INewIssues = {
  title: 'Test Issue',
  id: 1,
  column: 'ToDo',
  comments: 3,
  admin: 'Admin User',
  number: 123,
  dataCreated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  stars: 0,
};

describe('CardIssue Component', () => {
  test('renders correctly with all props', () => {
    render(<CardIssue {...mockIssue} handleDragStart={mockHandleDragStart} />);

    expect(screen.getByText('Test Issue')).toBeInTheDocument();
    expect(screen.getByText('#123 opened 3 days ago')).toBeInTheDocument();
    expect(screen.getByText('Admin User | Comments: 3')).toBeInTheDocument();
  });

  test('calls handleDragStart on drag start', () => {
    render(<CardIssue {...mockIssue} handleDragStart={mockHandleDragStart} />);

    const draggableCard = screen.getByText('Test Issue').closest('div');
    fireEvent.dragStart(draggableCard as HTMLElement);

    expect(mockHandleDragStart).toHaveBeenCalledWith(expect.any(Object), {
      title: 'Test Issue',
      id: 1,
      column: 'ToDo',
    });
  });
});
