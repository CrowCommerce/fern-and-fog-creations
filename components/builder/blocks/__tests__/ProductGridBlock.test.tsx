import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductGridBlock from '../ProductGridBlock';

describe('ProductGridBlock Component', () => {
  const defaultProps = {
    heading: 'Test Heading',
    subheading: 'Test Subheading',
    products: [
      {
        id: '1',
        name: 'Product 1',
        slug: 'product-1',
        category: 'Category A',
        price: 50.00,
        image: '/test-image-1.jpg',
      },
      {
        id: '2',
        name: 'Product 2',
        slug: 'product-2',
        category: 'Category B',
        price: 75.50,
        image: '/test-image-2.jpg',
      },
    ],
    ctaLabel: 'View More',
    ctaHref: '/products',
  };

  it('renders heading', () => {
    render(<ProductGridBlock {...defaultProps} />);
    
    expect(screen.getByText('Test Heading')).toBeInTheDocument();
  });

  it('renders subheading', () => {
    render(<ProductGridBlock {...defaultProps} />);
    
    expect(screen.getByText('Test Subheading')).toBeInTheDocument();
  });

  it('renders all products', () => {
    render(<ProductGridBlock {...defaultProps} />);
    
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('renders product categories', () => {
    render(<ProductGridBlock {...defaultProps} />);
    
    expect(screen.getByText('Category A')).toBeInTheDocument();
    expect(screen.getByText('Category B')).toBeInTheDocument();
  });

  it('formats product prices correctly', () => {
    render(<ProductGridBlock {...defaultProps} />);
    
    expect(screen.getByText('$50.00')).toBeInTheDocument();
    expect(screen.getByText('$75.50')).toBeInTheDocument();
  });

  it('renders product images', () => {
    render(<ProductGridBlock {...defaultProps} />);
    
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('src', '/test-image-1.jpg');
    expect(images[1]).toHaveAttribute('src', '/test-image-2.jpg');
  });

  it('renders product links with correct hrefs', () => {
    render(<ProductGridBlock {...defaultProps} />);
    
    const productLinks = screen.getAllByRole('link', { name: /Product \d/ });
    expect(productLinks[0]).toHaveAttribute('href', '/product/product-1');
    expect(productLinks[1]).toHaveAttribute('href', '/product/product-2');
  });

  it('renders CTA button with correct label and href', () => {
    render(<ProductGridBlock {...defaultProps} />);
    
    const ctaLink = screen.getByRole('link', { name: 'View More' });
    expect(ctaLink).toHaveAttribute('href', '/products');
  });

  it('uses default values when props are not provided', () => {
    render(<ProductGridBlock />);
    
    expect(screen.getByText('Featured Treasures')).toBeInTheDocument();
    expect(screen.getByText('Handpicked pieces available now')).toBeInTheDocument();
  });

  it('applies parchment background color by default', () => {
    const { container } = render(<ProductGridBlock {...defaultProps} />);
    
    const section = container.querySelector('.bg-parchment');
    expect(section).toBeInTheDocument();
  });

  it('applies mist background color when specified', () => {
    const { container } = render(<ProductGridBlock {...defaultProps} backgroundColor="mist" />);
    
    const section = container.querySelector('.bg-mist');
    expect(section).toBeInTheDocument();
  });

  it('applies white background color when specified', () => {
    const { container } = render(<ProductGridBlock {...defaultProps} backgroundColor="white" />);
    
    const section = container.querySelector('.bg-white');
    expect(section).toBeInTheDocument();
  });

  it('renders empty state with no products', () => {
    render(<ProductGridBlock {...defaultProps} products={[]} />);
    
    expect(screen.getByText('Test Heading')).toBeInTheDocument();
    // No products should be rendered
    expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
  });

  it('handles single product', () => {
    const singleProduct = [defaultProps.products[0]];
    render(<ProductGridBlock {...defaultProps} products={singleProduct} />);
    
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.queryByText('Product 2')).not.toBeInTheDocument();
  });

  it('renders product images with alt text', () => {
    render(<ProductGridBlock {...defaultProps} />);
    
    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('alt', 'Product 1');
    expect(images[1]).toHaveAttribute('alt', 'Product 2');
  });
});