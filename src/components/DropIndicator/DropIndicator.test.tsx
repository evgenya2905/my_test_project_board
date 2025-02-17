import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { DropIndicator } from './DropIndicator';

describe('DropIndicator', () => {
  it('renders with correct default attributes', () => {
    const { getByTestId } = render(
      <DropIndicator beforeId={null} column="todo" />
    );

    const dropIndicator = getByTestId('drop-indicator');
    expect(dropIndicator).toHaveAttribute('data-before', '-1');
    expect(dropIndicator).toHaveAttribute('data-column', 'todo');
  });

  it('renders with provided beforeId', () => {
    const { getByTestId } = render(
      <DropIndicator beforeId="123" column="inProgress" />
    );

    const dropIndicator = getByTestId('drop-indicator');
    expect(dropIndicator).toHaveAttribute('data-before', '123');
    expect(dropIndicator).toHaveAttribute('data-column', 'inProgress');
  });
});
