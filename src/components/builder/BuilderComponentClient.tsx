'use client';

/**
 * Builder.io Component Client Wrapper
 *
 * Client-side wrapper for Builder.io's BuilderComponent.
 * This component is necessary because Builder.io requires client-side JavaScript,
 * but we want to fetch content server-side in Next.js App Router.
 *
 * Usage:
 * ```tsx
 * // In a Server Component
 * const content = await resolveBuilderContent('page', { userAttributes: { urlPath: '/about' } });
 * return <BuilderComponentClient model="page" content={content} />;
 * ```
 */

import { BuilderComponent, builder } from '@builder.io/react';
import type { BuilderContent } from '@builder.io/sdk';
import { builderConfig } from '@/lib/builder/config';
import Link from 'next/link';

// Initialize Builder.io client-side
builder.init(builderConfig.apiKey);

export interface BuilderComponentClientProps {
  /** Builder.io model name */
  model: string;
  /** Pre-fetched Builder.io content (from server) */
  content: BuilderContent | null;
  /** Additional data to pass to Builder.io components (e.g., product, theme) */
  data?: Record<string, any>;
  /** Context functions/services for Builder.io components */
  context?: Record<string, any>;
}

/**
 * Client wrapper for Builder.io BuilderComponent
 *
 * Features:
 * - Accepts server-fetched content
 * - Custom link rendering for Next.js routing
 * - Passes data and context to child components
 * - Shows fallback if no content
 */
export function BuilderComponentClient({
  model,
  content,
  data,
  context,
}: BuilderComponentClientProps) {
  // If no content, show nothing (parent should handle 404)
  if (!content) {
    return null;
  }

  return (
    <BuilderComponent
      model={model}
      content={content}
      data={data}
      context={context}
      renderLink={(props: any) => {
        // Handle external links and hash links as plain <a>
        if (props.target === '_blank' || props.href?.startsWith('#')) {
          return <a {...props} />;
        }
        // Use Next.js Link for internal navigation
        return <Link {...props} />;
      }}
    />
  );
}

/**
 * Preview Mode Client Component
 *
 * Used for Builder.io visual editor preview mode.
 * Shows Builder.io content with live editing capabilities.
 */
export function BuilderComponentPreview({
  model,
  data,
  context,
}: Omit<BuilderComponentClientProps, 'content'>) {
  return (
    <BuilderComponent
      model={model}
      data={data}
      context={context}
      renderLink={(props: any) => {
        if (props.target === '_blank' || props.href?.startsWith('#')) {
          return <a {...props} />;
        }
        return <Link {...props} />;
      }}
    />
  );
}
