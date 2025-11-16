import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFound from '../not-found';

describe('NotFound Component', () => {
  it('renders 404 heading', () => {
    render(<NotFound />);
    
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('displays 404 error code', () => {
    render(<NotFound />);
    
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('displays helpful error message', () => {
    render(<NotFound />);
    
    expect(screen.getByText(/Sorry, we couldn't find the page you're looking for/i)).toBeInTheDocument();
  });

  it('renders go home link with correct href', () => {
    render(<NotFound />);
    
    const homeLink = screen.getByRole('link', { name: /go home/i });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders browse products link with correct href', () => {
    render(<NotFound />);
    
    const productsLink = screen.getByRole('link', { name: /browse products/i });
    expect(productsLink).toHaveAttribute('href', '/products');
  });

  it('renders all popular page links', () => {
    render(<NotFound />);
    
    expect(screen.getByRole('link', { name: /all products/i })).toHaveAttribute('href', '/products');
    expect(screen.getByRole('link', { name: /gallery/i })).toHaveAttribute('href', '/gallery');
    expect(screen.getByRole('link', { name: /about us/i })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '/contact');
  });

  it('renders icon SVG', () => {
    const { container } = render(<NotFound />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const { container } = render(<NotFound />);
    
    const mainDiv = container.querySelector('.bg-parchment');
    expect(mainDiv).toBeInTheDocument();
  });

  it('displays popular pages section', () => {
    render(<NotFound />);
    
    expect(screen.getByText(/popular pages:/i)).toBeInTheDocument();
  });

  it('has home icon in go home button', () => {
    const { container } = render(<NotFound />);
    
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(1); // Icon + main SVG
  });

  it('renders with proper accessibility', () => {
    render(<NotFound />);
    
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    links.forEach(link => {
      expect(link).toHaveAccessibleName();
    });
  });
});