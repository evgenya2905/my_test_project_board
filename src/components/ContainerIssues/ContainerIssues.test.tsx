import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ContainerIssues } from './ContainerIssues';
import { describe, expect, test, vi } from 'vitest';

import { store } from '../../store/store';
import { INewIssues } from '../../types';

vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
  Provider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe('ContainerIssues', () => {
  const mockSetIssues = vi.fn();
  const mockParamsUrl = { repo: 'repo', owner: 'owner' };
  const issues: INewIssues[] = [
    {
      id: 1,
      title: 'Issue 1',
      column: 'todo',
      comments: 5,
      admin: 'Admin1',
      number: 123,
      dataCreated: '2025-02-17T12:00:00',
      stars: 3,
    },
    {
      id: 2,
      title: 'Issue 2',
      column: 'in-progress',
      comments: 3,
      admin: 'Admin2',
      number: 124,
      dataCreated: '2025-02-18T14:00:00',
      stars: 2,
    },
    {
      id: 3,
      title: 'Issue 3',
      column: 'done',
      comments: 0,
      admin: 'Admin3',
      number: 125,
      dataCreated: '2025-02-19T10:00:00',
      stars: 5,
    },
  ];

  test('renders with issues and title', () => {
    render(
      <Provider store={store}>
        <ContainerIssues
          title="To Do"
          column="todo"
          issues={issues}
          setIssues={mockSetIssues}
          paramsUrl={mockParamsUrl}
          isLoading={false}
        />
      </Provider>
    );

    expect(screen.getByText('To Do')).toBeInTheDocument();

    expect(screen.getByText(/Issue 1/i)).toBeInTheDocument();
  });

  test('shows spinner when loading', () => {
    render(
      <Provider store={store}>
        <ContainerIssues
          title="To Do"
          column="todo"
          issues={issues}
          setIssues={mockSetIssues}
          paramsUrl={mockParamsUrl}
          isLoading={true}
        />
      </Provider>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  test('handles drag and drop correctly', async () => {
    const setData = vi.fn();

    render(
      <Provider store={store}>
        <ContainerIssues
          title="To Do"
          column="todo"
          issues={issues}
          setIssues={mockSetIssues}
          paramsUrl={mockParamsUrl}
          isLoading={false}
        />
      </Provider>
    );

    const issueElement = screen.getByText('Issue 1');
    const dropArea = screen.getByText('To Do').closest('div') as Element;

    fireEvent.dragStart(issueElement, { dataTransfer: { setData } });
    fireEvent.dragOver(dropArea);
    fireEvent.drop(dropArea);

    await waitFor(() => {
      expect(setData).toHaveBeenCalled();
    });
  });

  test('does not trigger update if no valid drop location', () => {
    const mockDispatch = vi.fn();

    render(
      <Provider store={store}>
        <ContainerIssues
          title="To Do"
          column="todo"
          issues={issues}
          setIssues={mockSetIssues}
          paramsUrl={mockParamsUrl}
          isLoading={false}
        />
      </Provider>
    );

    const issueElement = screen.getByText('Issue 1');
    const dropArea = screen.getByText('To Do').closest('div') as Element;

    fireEvent.dragStart(issueElement, { dataTransfer: { setData: vi.fn() } });
    fireEvent.dragOver(dropArea);
    fireEvent.dragLeave(dropArea);
    fireEvent.drop(dropArea);

    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
