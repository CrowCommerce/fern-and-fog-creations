#!/usr/bin/env tsx
/**
 * About Page Setup Script
 *
 * Creates about_page, about_process_step, and about_value metaobject definitions
 * and populates them with default content from the current about page.
 *
 * Usage:
 *   pnpm setup:about        # Execute migration
 *   pnpm setup:about:dry    # Dry-run mode (preview changes)
 */

import { validateConnection, shopifyAdminRequest } from './lib/shopify-admin.js';

const DRY_RUN = process.argv.includes('--dry-run');

interface MetaobjectDefinitionResponse {
  metaobjectDefinitionCreate: {
    metaobjectDefinition?: {
      id: string;
      type: string;
      name: string;
    };
    userErrors: Array<{ field?: string[]; message: string; code?: string }>;
  };
}

interface MetaobjectCreateResponse {
  metaobjectCreate: {
    metaobject?: {
      id: string;
      handle: string;
    };
    userErrors: Array<{ field?: string[]; message: string }>;
  };
}

/**
 * Create the about_page metaobject definition
 */
async function createAboutPageDefinition(): Promise<string> {
  const mutation = `
    mutation metaobjectDefinitionCreate($definition: MetaobjectDefinitionCreateInput!) {
      metaobjectDefinitionCreate(definition: $definition) {
        metaobjectDefinition {
          id
          type
          name
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `;

  const variables = {
    definition: {
      name: 'About Page',
      type: 'about_page',
      fieldDefinitions: [
        {
          key: 'hero_heading',
          name: 'Hero Heading',
          type: 'single_line_text_field',
          required: true,
          description: 'Main H1 heading',
        },
        {
          key: 'hero_intro',
          name: 'Hero Intro',
          type: 'multi_line_text_field',
          required: true,
          description: 'Hero subtitle/intro text',
        },
        {
          key: 'story_heading',
          name: 'Story Section Heading',
          type: 'single_line_text_field',
          required: true,
        },
        {
          key: 'story_content',
          name: 'Story Content',
          type: 'multi_line_text_field',
          required: true,
          description: 'Main story paragraphs (use \\n\\n for paragraph breaks)',
        },
        {
          key: 'quote_text',
          name: 'Quote Text',
          type: 'multi_line_text_field',
          required: false,
        },
        {
          key: 'quote_attribution',
          name: 'Quote Attribution',
          type: 'single_line_text_field',
          required: false,
        },
        {
          key: 'quote_image_url',
          name: 'Quote Image URL',
          type: 'single_line_text_field',
          required: false,
          description: 'Optional image for quote section',
        },
        {
          key: 'process_heading',
          name: 'Process Section Heading',
          type: 'single_line_text_field',
          required: true,
        },
        {
          key: 'values_heading',
          name: 'Values Section Heading',
          type: 'single_line_text_field',
          required: true,
        },
        {
          key: 'cta_heading',
          name: 'CTA Heading',
          type: 'single_line_text_field',
          required: true,
        },
        {
          key: 'cta_description',
          name: 'CTA Description',
          type: 'multi_line_text_field',
          required: true,
        },
        {
          key: 'cta_primary_text',
          name: 'Primary CTA Button Text',
          type: 'single_line_text_field',
          required: true,
        },
        {
          key: 'cta_primary_url',
          name: 'Primary CTA Button URL',
          type: 'single_line_text_field',
          required: true,
        },
        {
          key: 'cta_secondary_text',
          name: 'Secondary CTA Button Text',
          type: 'single_line_text_field',
          required: false,
        },
        {
          key: 'cta_secondary_url',
          name: 'Secondary CTA Button URL',
          type: 'single_line_text_field',
          required: false,
        },
      ],
      access: {
        storefront: 'PUBLIC_READ',
      },
    },
  };

  console.log('\n📝 Creating about_page metaobject definition...');

  if (DRY_RUN) {
    console.log('[DRY RUN] Would create definition with', variables.definition.fieldDefinitions.length, 'fields');
    return 'dry-run-about-page-definition';
  }

  const response = await shopifyAdminRequest<MetaobjectDefinitionResponse>(
    mutation,
    variables
  );

  if (response.metaobjectDefinitionCreate.userErrors.length > 0) {
    const errors = response.metaobjectDefinitionCreate.userErrors;
    const alreadyExists = errors.some((err) =>
      err.message.toLowerCase().includes('already exists') || err.code === 'TAKEN'
    );

    if (alreadyExists) {
      console.log('✓ Definition already exists, skipping...');
      return 'existing-definition';
    }

    console.error('❌ Failed to create about_page definition:');
    errors.forEach((err) => console.error(`  - ${err.message}`));
    throw new Error('Metaobject definition creation failed');
  }

  const definitionId = response.metaobjectDefinitionCreate.metaobjectDefinition!.id;
  console.log(`✓ Created about_page definition: ${definitionId}`);

  return definitionId;
}

/**
 * Create the about_process_step metaobject definition
 */
async function createProcessStepDefinition(): Promise<string> {
  const mutation = `
    mutation metaobjectDefinitionCreate($definition: MetaobjectDefinitionCreateInput!) {
      metaobjectDefinitionCreate(definition: $definition) {
        metaobjectDefinition {
          id
          type
          name
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `;

  const variables = {
    definition: {
      name: 'About Process Step',
      type: 'about_process_step',
      fieldDefinitions: [
        {
          key: 'title',
          name: 'Step Title',
          type: 'single_line_text_field',
          required: true,
          description: 'e.g., "1. Gathered"',
        },
        {
          key: 'description',
          name: 'Description',
          type: 'multi_line_text_field',
          required: true,
        },
        {
          key: 'icon_type',
          name: 'Icon Type',
          type: 'single_line_text_field',
          required: true,
          description: 'One of: gathered, crafted, treasured',
        },
        {
          key: 'sort_order',
          name: 'Sort Order',
          type: 'number_integer',
          required: true,
        },
      ],
      access: {
        storefront: 'PUBLIC_READ',
      },
    },
  };

  console.log('\n📝 Creating about_process_step metaobject definition...');

  if (DRY_RUN) {
    console.log('[DRY RUN] Would create definition with', variables.definition.fieldDefinitions.length, 'fields');
    return 'dry-run-process-definition';
  }

  const response = await shopifyAdminRequest<MetaobjectDefinitionResponse>(
    mutation,
    variables
  );

  if (response.metaobjectDefinitionCreate.userErrors.length > 0) {
    const errors = response.metaobjectDefinitionCreate.userErrors;
    const alreadyExists = errors.some((err) =>
      err.message.toLowerCase().includes('already exists') || err.code === 'TAKEN'
    );

    if (alreadyExists) {
      console.log('✓ Definition already exists, skipping...');
      return 'existing-definition';
    }

    console.error('❌ Failed to create about_process_step definition:');
    errors.forEach((err) => console.error(`  - ${err.message}`));
    throw new Error('Metaobject definition creation failed');
  }

  const definitionId = response.metaobjectDefinitionCreate.metaobjectDefinition!.id;
  console.log(`✓ Created about_process_step definition: ${definitionId}`);

  return definitionId;
}

/**
 * Create the about_value metaobject definition
 */
async function createValueDefinition(): Promise<string> {
  const mutation = `
    mutation metaobjectDefinitionCreate($definition: MetaobjectDefinitionCreateInput!) {
      metaobjectDefinitionCreate(definition: $definition) {
        metaobjectDefinition {
          id
          type
          name
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `;

  const variables = {
    definition: {
      name: 'About Value',
      type: 'about_value',
      fieldDefinitions: [
        {
          key: 'title',
          name: 'Value Title',
          type: 'single_line_text_field',
          required: true,
        },
        {
          key: 'description',
          name: 'Description',
          type: 'multi_line_text_field',
          required: true,
        },
        {
          key: 'sort_order',
          name: 'Sort Order',
          type: 'number_integer',
          required: true,
        },
      ],
      access: {
        storefront: 'PUBLIC_READ',
      },
    },
  };

  console.log('\n📝 Creating about_value metaobject definition...');

  if (DRY_RUN) {
    console.log('[DRY RUN] Would create definition with', variables.definition.fieldDefinitions.length, 'fields');
    return 'dry-run-value-definition';
  }

  const response = await shopifyAdminRequest<MetaobjectDefinitionResponse>(
    mutation,
    variables
  );

  if (response.metaobjectDefinitionCreate.userErrors.length > 0) {
    const errors = response.metaobjectDefinitionCreate.userErrors;
    const alreadyExists = errors.some((err) =>
      err.message.toLowerCase().includes('already exists') || err.code === 'TAKEN'
    );

    if (alreadyExists) {
      console.log('✓ Definition already exists, skipping...');
      return 'existing-definition';
    }

    console.error('❌ Failed to create about_value definition:');
    errors.forEach((err) => console.error(`  - ${err.message}`));
    throw new Error('Metaobject definition creation failed');
  }

  const definitionId = response.metaobjectDefinitionCreate.metaobjectDefinition!.id;
  console.log(`✓ Created about_value definition: ${definitionId}`);

  return definitionId;
}

/**
 * Create about page metaobject instances
 */
async function createAboutPageContent(): Promise<void> {
  const mutation = `
    mutation metaobjectCreate($metaobject: MetaobjectCreateInput!) {
      metaobjectCreate(metaobject: $metaobject) {
        metaobject {
          id
          handle
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  // Main about page
  const aboutPage = {
    type: 'about_page',
    handle: 'main',
    fields: [
      { key: 'hero_heading', value: 'About Fern & Fog' },
      { key: 'hero_intro', value: 'Where coastal treasures meet woodland wonders' },
      { key: 'story_heading', value: 'The Story' },
      {
        key: 'story_content',
        value: `Fern & Fog Creations was born from countless walks along the Oregon coast, where the mist meets the shore and treasures reveal themselves to those who pause to look.

I'm Heather, a maker and gatherer who believes that the most beautiful things come from nature itself. Every piece in my collection begins with a moment of discovery—a perfectly frosted piece of sea glass, a delicate wildflower pressed between pages, a piece of driftwood shaped by years of waves and weather.

What started as a personal practice of collecting and preserving these moments has grown into Fern & Fog Creations, where I transform these found treasures into wearable art and home décor that carry the spirit of the Pacific Northwest.

Each piece is one-of-a-kind, crafted by hand in small batches. No two items are exactly alike—because no two pieces of sea glass, no two ferns, no two pieces of driftwood are the same.`,
      },
      {
        key: 'quote_text',
        value: 'I believe that when you wear or display something made from the natural world, you carry a piece of that world with you—its stories, its journeys, its quiet beauty.',
      },
      { key: 'quote_attribution', value: 'Heather' },
      { key: 'quote_image_url', value: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?w=800&q=80' },
      { key: 'process_heading', value: 'The Making Process' },
      { key: 'values_heading', value: 'What I Believe' },
      { key: 'cta_heading', value: 'Ready to Find Your Treasure?' },
      { key: 'cta_description', value: 'Explore the collection or get in touch about a custom piece' },
      { key: 'cta_primary_text', value: 'Browse Shop' },
      { key: 'cta_primary_url', value: '/products' },
      { key: 'cta_secondary_text', value: 'Commission a Custom Piece' },
      { key: 'cta_secondary_url', value: '/contact' },
    ],
  };

  // Process steps
  const processSteps = [
    {
      type: 'about_process_step',
      handle: 'gathered',
      fields: [
        { key: 'title', value: '1. Gathered' },
        {
          key: 'description',
          value: 'Materials are mindfully collected from Pacific Northwest beaches, forests, and meadows—always with respect for the environment.',
        },
        { key: 'icon_type', value: 'gathered' },
        { key: 'sort_order', value: '1' },
      ],
    },
    {
      type: 'about_process_step',
      handle: 'crafted',
      fields: [
        { key: 'title', value: '2. Crafted' },
        {
          key: 'description',
          value: 'Each piece is handmade with care and attention to detail, using traditional and modern techniques to preserve and enhance natural beauty.',
        },
        { key: 'icon_type', value: 'crafted' },
        { key: 'sort_order', value: '2' },
      ],
    },
    {
      type: 'about_process_step',
      handle: 'treasured',
      fields: [
        { key: 'title', value: '3. Treasured' },
        {
          key: 'description',
          value: 'Your piece becomes part of your story, carrying with it the memory of the place it came from and the hands that crafted it.',
        },
        { key: 'icon_type', value: 'treasured' },
        { key: 'sort_order', value: '3' },
      ],
    },
  ];

  // Values
  const values = [
    {
      type: 'about_value',
      handle: 'ethical-sourcing',
      fields: [
        { key: 'title', value: 'Ethical Sourcing' },
        {
          key: 'description',
          value: 'All materials are gathered with permission and respect for the environment. I never take from protected areas and always follow Leave No Trace principles.',
        },
        { key: 'sort_order', value: '1' },
      ],
    },
    {
      type: 'about_value',
      handle: 'quality-over-quantity',
      fields: [
        { key: 'title', value: 'Quality Over Quantity' },
        {
          key: 'description',
          value: 'Each piece takes time. I create in small batches to ensure every item receives the attention it deserves.',
        },
        { key: 'sort_order', value: '2' },
      ],
    },
    {
      type: 'about_value',
      handle: 'sustainable-practice',
      fields: [
        { key: 'title', value: 'Sustainable Practice' },
        {
          key: 'description',
          value: 'Packaging is minimal and eco-friendly. Materials are natural and biodegradable whenever possible.',
        },
        { key: 'sort_order', value: '3' },
      ],
    },
    {
      type: 'about_value',
      handle: 'one-of-a-kind',
      fields: [
        { key: 'title', value: 'One-of-a-Kind' },
        {
          key: 'description',
          value: 'Because I work with natural materials, no two pieces are identical. Your item is truly unique.',
        },
        { key: 'sort_order', value: '4' },
      ],
    },
  ];

  // Create all metaobjects
  const allMetaobjects = [aboutPage, ...processSteps, ...values];

  console.log(`\n📄 Creating ${allMetaobjects.length} metaobjects...`);

  for (const metaobj of allMetaobjects) {
    console.log(`  Creating ${metaobj.type}: ${metaobj.handle}`);

    if (DRY_RUN) {
      console.log(`    [DRY RUN] Would create with ${metaobj.fields.length} fields`);
      continue;
    }

    const response = await shopifyAdminRequest<MetaobjectCreateResponse>(mutation, {
      metaobject: metaobj,
    });

    if (response.metaobjectCreate.userErrors.length > 0) {
      const errors = response.metaobjectCreate.userErrors;
      const alreadyExists = errors.some((err) =>
        err.message.toLowerCase().includes('already exists') ||
        err.message.toLowerCase().includes('handle has already been taken')
      );

      if (alreadyExists) {
        console.log(`    ⚠️  Already exists, skipping...`);
        continue;
      }

      console.error(`    ❌ Failed to create ${metaobj.handle}:`);
      errors.forEach((err) => console.error(`      - ${err.message}`));
      continue;
    }

    const created = response.metaobjectCreate.metaobject!;
    console.log(`    ✓ Created: ${created.handle} (${created.id})`);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║   About Page Setup Script                            ║');
  console.log('╚═══════════════════════════════════════════════════════╝');

  if (DRY_RUN) {
    console.log('\n🔍 DRY RUN MODE - No changes will be made\n');
  }

  try {
    // Validate Shopify connection
    await validateConnection();

    // Create metaobject definitions
    await createAboutPageDefinition();
    await createProcessStepDefinition();
    await createValueDefinition();

    // Create content instances
    await createAboutPageContent();

    console.log('\n✅ About page setup complete!');
    console.log('\n📋 Content created:');
    console.log('  - 1 about page (main)');
    console.log('  - 3 process steps (gathered, crafted, treasured)');
    console.log('  - 4 values (ethical sourcing, quality, sustainability, uniqueness)');
    console.log('\n📋 Next steps:');
    console.log('1. Visit Shopify Admin → Content → Metaobjects');
    console.log('2. Edit any of the about page metaobjects');
    console.log('3. Verify changes appear on /about page');
    console.log('4. Deploy to production\n');

    if (DRY_RUN) {
      console.log('💡 Run without --dry-run to execute migration\n');
    }
  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  }
}

main();
