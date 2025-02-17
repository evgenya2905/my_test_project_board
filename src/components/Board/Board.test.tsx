import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { Board } from './Board';
import { describe, expect, it, vi } from 'vitest';

describe('Board component', () => {
  it('renders the form for entering repo URL', () => {
    render(
      <Provider store={store}>
        <Board />
      </Provider>
    );

    expect(screen.getByPlaceholderText(/Enter repo URL/i)).toBeInTheDocument();
    expect(screen.getByText(/Load issues/i)).toBeInTheDocument();
  });

  it('renders ContainerIssues components', () => {
    render(
      <Provider store={store}>
        <Board />
      </Provider>
    );

    expect(screen.getByText(/toDo/i)).toBeInTheDocument();
    expect(screen.getByText(/In Progress/i)).toBeInTheDocument();
    expect(screen.getByText(/Done/i)).toBeInTheDocument();
  });

  it('parses a valid GitHub repo URL correctly', async () => {
    render(
      <Provider store={store}>
        <Board />
      </Provider>
    );

    const input = screen.getByPlaceholderText(/Enter repo URL/i);
    const form = screen.getByTestId('form');

    fireEvent.change(input, {
      target: { value: 'https://github.com/owner/repo' },
    });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('owner')).toBeInTheDocument();
      expect(screen.getByText('repo')).toBeInTheDocument();
    });
  });

  it('shows alert for incorrect URL', async () => {
    global.alert = vi.fn();
    render(
      <Provider store={store}>
        <Board />
      </Provider>
    );

    const input = screen.getByPlaceholderText(/Enter repo URL/i);
    const form = screen.getByTestId('form');

    fireEvent.change(input, { target: { value: 'invalid-url' } });
    fireEvent.submit(form);

    expect(global.alert).toHaveBeenCalledWith('incorrect url');
  });
});
