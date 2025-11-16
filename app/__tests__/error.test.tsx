import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Error from '../error';

describe('Error Component', () => {
  const mockError = new Error('Test error message');
  const mockReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console.error to avoid cluttering test output
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders error page with correct heading', () => {
    render(<Error error={mockError} reset={mockReset} />);
    
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Error error={mockError} reset={mockReset} />);
    
    expect(screen.getByText(/We're sorry, but something unexpected happened/i)).toBeInTheDocument();
  });

  it('displays error digest when provided', () => {
    const errorWithDigest = Object.assign(mockError, { digest: 'abc123' });
    render(<Error error={errorWithDigest} reset={mockReset} />);
    
    expect(screen.getByText(/Error ID: abc123/i)).toBeInTheDocument();
  });

  it('does not display error digest when not provided', () => {
    render(<Error error={mockError} reset={mockReset} />);
    
    expect(screen.queryByText(/Error ID:/i)).not.toBeInTheDocument();
  });

  it('calls reset function when "Try again" button is clicked', () => {
    render(<Error error={mockError} reset={mockReset} />);
    
    const tryAgainButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(tryAgainButton);
    
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it('renders return home link with correct href', () => {
    render(<Error error={mockError} reset={mockReset} />);
    
    const homeLink = screen.getByRole('link', { name: /return home/i });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders contact us link', () => {
    render(<Error error={mockError} reset={mockReset} />);
    
    const contactLink = screen.getByRole('link', { name: /contact us/i });
    expect(contactLink).toHaveAttribute('href', '/contact');
  });

  it('logs error to console on mount', () => {
    const consoleSpy = vi.spyOn(console, 'error');
    
    render(<Error error={mockError} reset={mockReset} />);
    
    expect(consoleSpy).toHaveBeenCalledWith('Application error:', mockError);
  });

  it('renders error icon', () => {
    const { container } = render(<Error error={mockError} reset={mockReset} />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const { container } = render(<Error error={mockError} reset={mockReset} />);
    
    const mainDiv = container.querySelector('.bg-parchment');
    expect(mainDiv).toBeInTheDocument();
  });

  it('handles multiple reset button clicks', () => {
    render(<Error error={mockError} reset={mockReset} />);
    
    const tryAgainButton = screen.getByRole('button', { name: /try again/i });
    
    fireEvent.click(tryAgainButton);
    fireEvent.click(tryAgainButton);
    fireEvent.click(tryAgainButton);
    
    expect(mockReset).toHaveBeenCalledTimes(3);
  });

  it('renders with different error types', () => {
    const typeError = new TypeError('Type error message');
    render(<Error error={typeError} reset={mockReset} />);
    
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
  });

  it('handles error without message', () => {
    const emptyError = new Error();
    render(<Error error={emptyError} reset={mockReset} />);
    
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });
});