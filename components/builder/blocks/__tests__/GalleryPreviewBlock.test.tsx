import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GalleryPreviewBlock from '../GalleryPreviewBlock';

describe('GalleryPreviewBlock Component', () => {
  const defaultProps = {
    heading: 'Gallery Test',
    subheading: 'Gallery Subheading',
    items: [
      {
        id: '1',
        title: 'Item 1',
        image: '/gallery-1.jpg',
        materials: ['Material A', 'Material B'],
        story: 'Story for item 1',
      },
      {
        id: '2',
        title: 'Item 2',
        image: '/gallery-2.jpg',
        materials: ['Material C'],
        story: 'Story for item 2',
      },
    ],
    ctaLabel: 'View Gallery',
    ctaHref: '/gallery',
  };

  it('renders heading', () => {
    render(<GalleryPreviewBlock {...defaultProps} />);
    
    expect(screen.getByText('Gallery Test')).toBeInTheDocument();
  });

  it('renders subheading', () => {
    render(<GalleryPreviewBlock {...defaultProps} />);
    
    expect(screen.getByText('Gallery Subheading')).toBeInTheDocument();
  });

  it('renders all gallery items', () => {
    render(<GalleryPreviewBlock {...defaultProps} />);
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('renders item stories', () => {
    render(<GalleryPreviewBlock {...defaultProps} />);
    
    expect(screen.getByText('Story for item 1')).toBeInTheDocument();
    expect(screen.getByText('Story for item 2')).toBeInTheDocument();
  });

  it('renders materials for each item', () => {
    render(<GalleryPreviewBlock {...defaultProps} />);
    
    expect(screen.getByText(/Material A/)).toBeInTheDocument();
    expect(screen.getByText(/Material B/)).toBeInTheDocument();
    expect(screen.getByText(/Material C/)).toBeInTheDocument();
  });

  it('renders gallery images', () => {
    render(<GalleryPreviewBlock {...defaultProps} />);
    
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('src', '/gallery-1.jpg');
    expect(images[1]).toHaveAttribute('src', '/gallery-2.jpg');
  });

  it('renders CTA link with correct href', () => {
    render(<GalleryPreviewBlock {...defaultProps} />);
    
    const ctaLink = screen.getByRole('link', { name: 'View Gallery' });
    expect(ctaLink).toHaveAttribute('href', '/gallery');
  });

  it('uses default values when props are not provided', () => {
    render(<GalleryPreviewBlock />);
    
    expect(screen.getByText('Stories in Every Piece')).toBeInTheDocument();
  });

  it('applies moss background color by default', () => {
    const { container } = render(<GalleryPreviewBlock {...defaultProps} />);
    
    const section = container.querySelector('.bg-moss');
    expect(section).toBeInTheDocument();
  });

  it('applies fern background color when specified', () => {
    const { container } = render(<GalleryPreviewBlock {...defaultProps} backgroundColor="fern" />);
    
    const section = container.querySelector('.bg-fern');
    expect(section).toBeInTheDocument();
  });

  it('applies parchment background color when specified', () => {
    const { container } = render(<GalleryPreviewBlock {...defaultProps} backgroundColor="parchment" />);
    
    const section = container.querySelector('.bg-parchment');
    expect(section).toBeInTheDocument();
  });

  it('handles empty items array', () => {
    render(<GalleryPreviewBlock {...defaultProps} items={[]} />);
    
    expect(screen.getByText('Gallery Test')).toBeInTheDocument();
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
  });

  it('renders single gallery item', () => {
    const singleItem = [defaultProps.items[0]];
    render(<GalleryPreviewBlock {...defaultProps} items={singleItem} />);
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
  });

  it('renders images with alt text', () => {
    render(<GalleryPreviewBlock {...defaultProps} />);
    
    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('alt', 'Item 1');
    expect(images[1]).toHaveAttribute('alt', 'Item 2');
  });

  it('handles items with multiple materials', () => {
    render(<GalleryPreviewBlock {...defaultProps} />);
    
    // Should render materials separated by bullet points
    const item1Materials = screen.getByText(/Material A/);
    expect(item1Materials.textContent).toContain('Material A');
    expect(item1Materials.textContent).toContain('Material B');
  });
});