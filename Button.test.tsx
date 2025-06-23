import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { toBeInTheDocument } from '@testing-library/jest-dom/matchers';
import { Button } from './Button';

expect.extend({ toBeInTheDocument });

describe('Button component', () => {
  it('renders with text', () => {
    render(<Button>Click</Button>);
    expect(screen.getByText('Click')).toBeInTheDocument();
  });
});
