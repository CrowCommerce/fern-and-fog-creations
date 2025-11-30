#!/usr/bin/env tsx
/**
 * Contact Page Setup Script
 *
 * Creates contact_page metaobject definition and default contact page content.
 *
 * Usage:
 *   pnpm setup:contact        # Execute migration
 *   pnpm setup:contact:dry    # Dry-run mode (preview changes)
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
 * Create the contact_page metaobject definition
 */
async function createContactPageDefinition(): Promise<string> {
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
      name: 'Contact Page',
      type: 'contact_page',
      fieldDefinitions: [
        {
          key: 'heading',
          name: 'Page Heading',
          type: 'single_line_text_field',
          required: true,
          description: 'Main H1 heading for contact page',
        },
        {
          key: 'description',
          name: 'Description',
          type: 'multi_line_text_field',
          required: true,
          description: 'Introductory paragraph',
        },
        {
          key: 'email_display',
          name: 'Email Address (Display)',
          type: 'single_line_text_field',
          required: false,
          description: 'Contact email to display (optional)',
        },
        {
          key: 'phone_display',
          name: 'Phone Number (Display)',
          type: 'single_line_text_field',
          required: false,
          description: 'Contact phone to display (optional)',
        },
        {
          key: 'business_hours',
          name: 'Business Hours',
          type: 'multi_line_text_field',
          required: false,
          description: 'Business hours text (optional)',
        },
        {
          key: 'response_time',
          name: 'Response Time Text',
          type: 'single_line_text_field',
          required: false,
          description: 'Expected response time message',
        },
      ],
      access: {
        storefront: 'PUBLIC_READ',
      },
    },
  };

  console.log('\n📝 Creating contact_page metaobject definition...');

  if (DRY_RUN) {
    console.log('[DRY RUN] Would create definition with fields:');
    variables.definition.fieldDefinitions.forEach((field) => {
      console.log(`  - ${field.name} (${field.key}): ${field.type}${field.required ? ' [required]' : ''}`);
    });
    return 'dry-run-definition-id';
  }

  const response = await shopifyAdminRequest<MetaobjectDefinitionResponse>(
    mutation,
    variables
  );

  if (response.metaobjectDefinitionCreate.userErrors.length > 0) {
    const errors = response.metaobjectDefinitionCreate.userErrors;

    // Check if error is "already exists"
    const alreadyExists = errors.some((err) =>
      err.message.toLowerCase().includes('already exists') ||
      err.code === 'TAKEN'
    );

    if (alreadyExists) {
      console.log('✓ Definition already exists, skipping...');
      // Return a placeholder ID (we'll handle this gracefully)
      return 'existing-definition';
    }

    console.error('❌ Failed to create contact_page definition:');
    errors.forEach((err) => console.error(`  - ${err.message}`));
    throw new Error('Metaobject definition creation failed');
  }

  const definitionId = response.metaobjectDefinitionCreate.metaobjectDefinition!.id;
  console.log(`✓ Created contact_page definition: ${definitionId}`);

  return definitionId;
}

/**
 * Create default contact page metaobject
 */
async function createContactPageMetaobject(): Promise<void> {
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

  const contactPage = {
    type: 'contact_page',
    handle: 'main',
    fields: [
      { key: 'heading', value: 'Get in Touch' },
      {
        key: 'description',
        value: "I'd love to hear from you. Whether you have a question about a piece, want to commission something custom, or just want to say hello.",
      },
      {
        key: 'response_time',
        value: 'I typically respond within 1-2 business days. Thank you for your patience!',
      },
    ],
  };

  console.log(`\n📄 Creating contact page: ${contactPage.handle}`);

  if (DRY_RUN) {
    console.log('[DRY RUN] Would create metaobject:');
    console.log(`  Handle: ${contactPage.handle}`);
    console.log(`  Fields:`);
    contactPage.fields.forEach((field) => {
      const preview = field.value.length > 60
        ? field.value.substring(0, 60) + '...'
        : field.value;
      console.log(`    - ${field.key}: "${preview}"`);
    });
    return;
  }

  const response = await shopifyAdminRequest<MetaobjectCreateResponse>(
    mutation,
    { metaobject: contactPage }
  );

  if (response.metaobjectCreate.userErrors.length > 0) {
    const errors = response.metaobjectCreate.userErrors;

    // Check if already exists
    const alreadyExists = errors.some((err) =>
      err.message.toLowerCase().includes('already exists') ||
      err.message.toLowerCase().includes('handle has already been taken')
    );

    if (alreadyExists) {
      console.log(`  ⚠️  Contact page already exists, skipping...`);
      return;
    }

    console.error(`  ❌ Failed to create contact page:`);
    errors.forEach((err) => console.error(`    - ${err.message}`));
    return;
  }

  const metaobject = response.metaobjectCreate.metaobject!;
  console.log(`  ✓ Created: ${metaobject.handle} (${metaobject.id})`);
}

/**
 * Main execution
 */
async function main() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║   Contact Page Setup Script                          ║');
  console.log('╚═══════════════════════════════════════════════════════╝');

  if (DRY_RUN) {
    console.log('\n🔍 DRY RUN MODE - No changes will be made\n');
  }

  try {
    // Validate Shopify connection
    await validateConnection();

    // Create metaobject definition
    const definitionId = await createContactPageDefinition();

    // Create default contact page
    await createContactPageMetaobject();

    console.log('\n✅ Contact page setup complete!');
    console.log('\nCustomize at: Shopify Admin → Content → Metaobjects → Contact Page');

    if (DRY_RUN) {
      console.log('\n💡 Run without --dry-run to execute setup');
    }

    console.log('\n💡 Tip: Run `pnpm setup:all` to set up all page content at once\n');
  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  }
}

main();
