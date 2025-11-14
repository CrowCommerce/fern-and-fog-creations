'use client';

/**
 * Builder.io Component Registration
 *
 * Registers all custom Fern & Fog Creations components
 * with Builder.io so they appear in the visual editor as drag-and-drop blocks.
 */

import { Builder } from '@builder.io/react';
import dynamic from 'next/dynamic';

// Dynamically import components for code splitting
const HeroBlock = dynamic(() => import('./blocks/HeroBlock'));
const CategoryGridBlock = dynamic(() => import('./blocks/CategoryGridBlock'));
const FeatureGridBlock = dynamic(() => import('./blocks/FeatureGridBlock'));
const TextBlock = dynamic(() => import('./blocks/TextBlock'));
const CTABlock = dynamic(() => import('./blocks/CTABlock'));

/**
 * Register Fern & Fog Design Tokens
 *
 * Makes brand colors and typography available as presets in Builder.io visual editor.
 * Colors will appear as visual swatches instead of plain text.
 */
Builder.register('editor.settings', {
  styleStrictMode: false,
  allowOverridingTokens: true, // Allow custom values while providing brand presets
  designTokens: {
    colors: [
      {
        name: 'Moss',
        value: 'var(--color-moss)',
      },
      {
        name: 'Fern',
        value: 'var(--color-fern)',
      },
      {
        name: 'Parchment',
        value: 'var(--color-parchment)',
      },
      {
        name: 'Bark',
        value: 'var(--color-bark)',
      },
      {
        name: 'Mist',
        value: 'var(--color-mist)',
      },
      {
        name: 'Gold',
        value: 'var(--color-gold)',
      },
    ],
  },
});

/**
 * Initialize custom insert menu for Fern & Fog components
 */
Builder.register('insertMenu', {
  name: 'Fern & Fog Components',
  items: [
    { name: 'HeroBlock' },
    { name: 'CategoryGridBlock' },
    { name: 'FeatureGridBlock' },
    { name: 'TextBlock' },
    { name: 'CTABlock' },
  ],
});

/**
 * Register HeroBlock - Full-width hero section
 */
Builder.registerComponent(HeroBlock, {
  name: 'HeroBlock',
  image: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F52dcecf48f9c48cc8ddd8f81fec63236',
  description: 'Full-width hero section with background image, heading, and dual CTAs',
  inputs: [
    {
      name: 'backgroundImage',
      type: 'file',
      allowedFileTypes: ['jpeg', 'jpg', 'png', 'webp'],
      required: true,
      defaultValue: '/stock-assets/hero/coastal-shells.jpg',
      helperText: 'Background image for hero section',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Handmade Coastal & Woodland Treasures',
      helperText: 'Main hero heading',
    },
    {
      name: 'description',
      type: 'longText',
      required: true,
      defaultValue: 'Sea glass earrings, pressed flower resin, driftwood décor—crafted in small batches with materials gathered from the Pacific Northwest shores.',
      helperText: 'Hero description text',
    },
    {
      name: 'primaryCTA',
      type: 'object',
      defaultValue: {
        label: 'View Gallery',
        href: '/gallery',
      },
      subFields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          defaultValue: 'View Gallery',
        },
        {
          name: 'href',
          type: 'text',
          required: true,
          defaultValue: '/gallery',
        },
      ],
    },
    {
      name: 'secondaryCTA',
      type: 'object',
      defaultValue: {
        label: 'Shop New Arrivals',
        href: '/products',
      },
      subFields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          defaultValue: 'Shop New Arrivals',
        },
        {
          name: 'href',
          type: 'text',
          required: true,
          defaultValue: '/products',
        },
      ],
    },
  ],
});

/**
 * Register CategoryGridBlock - 4-column category grid
 */
Builder.registerComponent(CategoryGridBlock, {
  name: 'CategoryGridBlock',
  image: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F8c7c3b7b7f5a4c7c9f5a4c7c9f5a4c7c',
  description: '4-column grid showcasing product categories with images',
  inputs: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Explore Our Collections',
    },
    {
      name: 'subheading',
      type: 'text',
      defaultValue: 'Each piece is one-of-a-kind, crafted from natural materials',
    },
    {
      name: 'categories',
      type: 'list',
      required: true,
      defaultValue: [
        {
          id: '1',
          name: 'Earrings',
          slug: 'earrings',
          description: 'Sea glass & sterling silver',
          image: '/stock-assets/categories/earrings.jpg',
        },
        {
          id: '2',
          name: 'Resin Art',
          slug: 'resin',
          description: 'Pressed flowers preserved',
          image: '/stock-assets/categories/resin.jpg',
        },
        {
          id: '3',
          name: 'Driftwood',
          slug: 'driftwood',
          description: 'Coastal wood sculptures',
          image: '/stock-assets/categories/driftwood.jpg',
        },
        {
          id: '4',
          name: 'Wall Hangings',
          slug: 'wall-hangings',
          description: 'Natural fiber & wood',
          image: '/stock-assets/categories/wall-hangings.jpg',
        },
      ],
      subFields: [
        {
          name: 'id',
          type: 'text',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          helperText: 'URL slug (e.g., "earrings")',
        },
        {
          name: 'description',
          type: 'text',
          required: true,
        },
        {
          name: 'image',
          type: 'file',
          allowedFileTypes: ['jpeg', 'jpg', 'png', 'webp'],
          required: true,
        },
      ],
    },
    {
      name: 'showViewAllLink',
      type: 'boolean',
      defaultValue: true,
    },
    {
      name: 'viewAllHref',
      type: 'text',
      defaultValue: '/categories',
      showIf: 'options.get("showViewAllLink") === true',
    },
  ],
});

/**
 * Register FeatureGridBlock - 3-column features with icons
 */
Builder.registerComponent(FeatureGridBlock, {
  name: 'FeatureGridBlock',
  image: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F3f8c3b7b7f5a4c7c9f5a4c7c9f5a4c7c',
  description: '3-column feature grid with icons (perfect for "Why Us" sections)',
  inputs: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Why Handmade Matters',
    },
    {
      name: 'subheading',
      type: 'text',
      defaultValue: 'Every piece tells a story of the land, the maker, and the moment of creation',
    },
    {
      name: 'features',
      type: 'list',
      required: true,
      defaultValue: [
        {
          name: 'Gathered',
          description: 'Each material is mindfully collected from Pacific Northwest shores and forests.',
          iconEmoji: '🌿',
        },
        {
          name: 'Crafted',
          description: 'Handmade with care and attention to detail, every piece is unique.',
          iconEmoji: '🐚',
        },
        {
          name: 'Treasured',
          description: 'Designed to become heirlooms that carry stories through time.',
          iconEmoji: '🌊',
        },
      ],
      subFields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'longText',
          required: true,
        },
        {
          name: 'iconEmoji',
          type: 'text',
          helperText: 'Single emoji (e.g., 🌿, 🐚, 🌊)',
        },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'text',
      enum: ['mist', 'parchment', 'white'],
      defaultValue: 'mist',
    },
  ],
});

/**
 * Register TextBlock - Flexible text content
 */
Builder.registerComponent(TextBlock, {
  name: 'TextBlock',
  image: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F1c7c3b7b7f5a4c7c9f5a4c7c9f5a4c7c',
  description: 'Flexible text block with brand styling (supports HTML)',
  inputs: [
    {
      name: 'heading',
      type: 'text',
      helperText: 'Optional heading',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      defaultValue: 'Add your content here in Builder.io',
    },
    {
      name: 'textAlign',
      type: 'text',
      enum: ['left', 'center', 'right'],
      defaultValue: 'center',
    },
    {
      name: 'backgroundColor',
      type: 'text',
      enum: ['parchment', 'mist', 'white', 'transparent'],
      defaultValue: 'transparent',
    },
    {
      name: 'maxWidth',
      type: 'text',
      enum: ['sm', 'md', 'lg', 'xl', 'full'],
      defaultValue: 'lg',
      helperText: 'Maximum content width',
    },
  ],
});

/**
 * Register CTABlock - Call-to-action section
 */
Builder.registerComponent(CTABlock, {
  name: 'CTABlock',
  image: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F9c7c3b7b7f5a4c7c9f5a4c7c9f5a4c7c',
  description: 'Call-to-action section with buttons',
  inputs: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Ready to Start Your Collection?',
    },
    {
      name: 'description',
      type: 'text',
      defaultValue: 'Discover unique, handcrafted pieces that tell a story.',
    },
    {
      name: 'primaryButtonLabel',
      type: 'text',
      defaultValue: 'Shop Now',
    },
    {
      name: 'primaryButtonHref',
      type: 'text',
      defaultValue: '/products',
    },
    {
      name: 'secondaryButtonLabel',
      type: 'text',
      helperText: 'Optional secondary button',
    },
    {
      name: 'secondaryButtonHref',
      type: 'text',
      showIf: 'options.get("secondaryButtonLabel")',
    },
    {
      name: 'backgroundColor',
      type: 'text',
      enum: ['moss', 'fern', 'gold', 'parchment'],
      defaultValue: 'moss',
    },
  ],
});

console.log('[Builder.io] Fern & Fog custom components registered successfully!');
