'use client';

/**
 * TextBlock - Flexible text content block with brand styling
 *
 * Perfect for rich text sections, quotes, or standalone paragraphs.
 */

export interface TextBlockProps {
  heading?: string;
  content?: string;
  textAlign?: 'left' | 'center' | 'right';
  backgroundColor?: 'parchment' | 'mist' | 'white' | 'transparent';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export default function TextBlock({
  heading,
  content = 'Add your content here in Builder.io',
  textAlign = 'center',
  backgroundColor = 'transparent',
  maxWidth = 'lg',
}: TextBlockProps) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[textAlign];

  const bgClass = {
    parchment: 'bg-parchment',
    mist: 'bg-mist',
    white: 'bg-white',
    transparent: '',
  }[backgroundColor];

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full',
  }[maxWidth];

  return (
    <div className={`py-16 ${bgClass}`}>
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${maxWidthClass}`}>
        <div className={alignClass}>
          {heading && (
            <h2 className="text-3xl font-display font-bold tracking-tight text-bark mb-6">
              {heading}
            </h2>
          )}
          <div
            className="text-lg text-bark/80 leading-relaxed prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
}
