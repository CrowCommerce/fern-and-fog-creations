'use client';

/**
 * Builder.io Initialization Component
 *
 * This client component initializes Builder.io and loads component registrations.
 * It must be imported in the root layout to ensure Builder.io is ready
 * before any pages render.
 *
 * This component renders nothing but has important side effects:
 * - Initializes Builder.io SDK with API key
 * - Registers custom components for visual editor
 * - Sets up Builder.io configuration
 */

import { useEffect } from 'react';
import { builder } from '@builder.io/react';
import { builderConfig } from '@/lib/builder/config';

// Import component registrations (side effect - registers components)
import './register-components';

/**
 * BuilderInit component
 *
 * Place this in your root layout to initialize Builder.io globally.
 * It only needs to render once at the app level.
 */
export function BuilderInit() {
  useEffect(() => {
    // Initialize Builder.io SDK
    builder.init(builderConfig.apiKey);

    // Log successful initialization (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Builder.io] SDK initialized with API key');
      console.log('[Builder.io] Custom components registered');
    }
  }, []);

  // This component renders nothing
  return null;
}
