'use client';

/**
 * Builder.io Component Registration
 *
 * This file registers all custom Fern & Fog Creations components
 * with Builder.io so they appear in the visual editor as drag-and-drop blocks.
 *
 * Components are registered with:
 * - Display name and description
 * - Input schema (editable props in visual editor)
 * - Preview thumbnail
 * - Custom insert menu grouping
 *
 * To add a new component:
 * 1. Import the component wrapper
 * 2. Call Builder.registerComponent() with input schema
 * 3. Add to custom insert menu (optional)
 */

import { Builder } from '@builder.io/react';

/**
 * Initialize custom insert menu for Fern & Fog components
 * This creates a dedicated section in Builder.io's component library
 */
Builder.register('insertMenu', {
  name: 'Fern & Fog Components',
  items: [
    { name: 'HeroBlock' },
    { name: 'CategoryGridBlock' },
    { name: 'FeatureGridBlock' },
    { name: 'GalleryBlock' },
    { name: 'CTABlock' },
    { name: 'TextBlock' },
    { name: 'ImageBlock' },
    { name: 'SpacerBlock' },
  ],
});

/**
 * Component registrations will be added here in Phase 3
 *
 * Example pattern:
 *
 * import dynamic from 'next/dynamic';
 * const HeroBlock = dynamic(() => import('./blocks/HeroBlock'));
 *
 * Builder.registerComponent(HeroBlock, {
 *   name: 'HeroBlock',
 *   image: 'https://cdn.builder.io/api/v1/image/assets%2F...',
 *   description: 'Full-width hero section with coastal theming',
 *   inputs: [
 *     {
 *       name: 'backgroundImage',
 *       type: 'file',
 *       allowedFileTypes: ['jpeg', 'png', 'webp'],
 *       required: true,
 *     },
 *     {
 *       name: 'heading',
 *       type: 'text',
 *       defaultValue: 'Handcrafted Coastal Treasures',
 *     },
 *     // ... more inputs
 *   ],
 * });
 */

// Component registrations will be added in Phase 3
console.log('[Builder.io] Component registration loaded - ready for custom components');
