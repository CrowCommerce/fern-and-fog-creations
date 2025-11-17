/**
 * Shopify Image Upload Handler
 *
 * Handles the three-step process of uploading images to Shopify:
 * 1. Stage upload via stagedUploadsCreate mutation
 * 2. Upload file to staged URL via HTTP POST
 * 3. Create file asset via fileCreate mutation
 */

import * as fs from 'fs';
import * as path from 'path';
import { shopifyAdminRequest, type ShopifyMutationResponse } from './shopify-admin.js';

interface StagedTarget {
  url: string;
  resourceUrl: string;
  parameters: Array<{ name: string; value: string }>;
}

interface StagedUploadResponse {
  stagedUploadsCreate: {
    stagedTargets: StagedTarget[];
    userErrors: Array<{ field?: string[]; message: string }>;
  };
}

interface FileCreateResponse {
  fileCreate: {
    files: Array<{
      id: string;
      alt?: string;
      createdAt: string;
    }>;
    userErrors: Array<{ field?: string[]; message: string }>;
  };
}

/**
 * Get MIME type from file extension
 */
function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  };
  return mimeTypes[ext] || 'image/jpeg';
}

/**
 * Stage an upload with Shopify
 *
 * @param filename - Name of the file to upload
 * @param mimeType - MIME type of the file
 * @returns Staged upload target information
 */
async function stageUpload(
  filename: string,
  mimeType: string
): Promise<StagedTarget> {
  const mutation = `
    mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
      stagedUploadsCreate(input: $input) {
        stagedTargets {
          url
          resourceUrl
          parameters {
            name
            value
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: [
      {
        resource: 'IMAGE',
        filename,
        mimeType,
        httpMethod: 'POST',
      },
    ],
  };

  const result = await shopifyAdminRequest<StagedUploadResponse>(
    mutation,
    variables
  );

  if (result.stagedUploadsCreate.userErrors.length > 0) {
    const errors = result.stagedUploadsCreate.userErrors
      .map(e => e.message)
      .join(', ');
    throw new Error(`Failed to stage upload: ${errors}`);
  }

  const stagedTarget = result.stagedUploadsCreate.stagedTargets[0];
  if (!stagedTarget) {
    throw new Error('No staged target returned from Shopify');
  }

  return stagedTarget;
}

/**
 * Upload file to staged URL using FormData
 *
 * @param stagedTarget - Staged upload target information
 * @param fileBuffer - File buffer to upload
 */
async function uploadToStagedUrl(
  stagedTarget: StagedTarget,
  fileBuffer: Buffer
): Promise<void> {
  const formData = new FormData();

  // Add all parameters from Shopify
  for (const param of stagedTarget.parameters) {
    formData.append(param.name, param.value);
  }

  // Add the file as a Blob
  const blob = new Blob([fileBuffer]);
  formData.append('file', blob);

  const response = await fetch(stagedTarget.url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to upload file to staged URL: ${response.status} ${response.statusText}\n${errorText}`
    );
  }
}

/**
 * Create a file asset in Shopify after uploading to staged URL
 *
 * @param resourceUrl - Resource URL from staged upload
 * @param alt - Alt text for the image
 * @returns Shopify file ID (GID)
 */
async function createFile(resourceUrl: string, alt: string): Promise<string> {
  const mutation = `
    mutation fileCreate($files: [FileCreateInput!]!) {
      fileCreate(files: $files) {
        files {
          id
          alt
          createdAt
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    files: [
      {
        alt,
        contentType: 'IMAGE',
        originalSource: resourceUrl,
      },
    ],
  };

  const result = await shopifyAdminRequest<FileCreateResponse>(mutation, variables);

  if (result.fileCreate.userErrors.length > 0) {
    const errors = result.fileCreate.userErrors.map(e => e.message).join(', ');
    throw new Error(`Failed to create file: ${errors}`);
  }

  const file = result.fileCreate.files[0];
  if (!file) {
    throw new Error('No file returned from fileCreate mutation');
  }

  return file.id;
}

/**
 * Upload an image to Shopify and return its file ID
 *
 * This is the main entry point that orchestrates the three-step upload process:
 * 1. Stage upload
 * 2. Upload file to staged URL
 * 3. Create file asset
 *
 * @param localPath - Path to the image file (relative to project root)
 * @param alt - Alt text for the image
 * @returns Shopify file GID (e.g., "gid://shopify/MediaImage/123456")
 */
export async function uploadImage(
  localPath: string,
  alt: string
): Promise<string> {
  // Read file from disk
  const absolutePath = path.join(process.cwd(), localPath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Image file not found: ${absolutePath}`);
  }

  const fileBuffer = fs.readFileSync(absolutePath);
  const filename = path.basename(localPath);
  const mimeType = getMimeType(filename);

  try {
    // Step 1: Stage upload
    const stagedTarget = await stageUpload(filename, mimeType);

    // Step 2: Upload file to staged URL
    await uploadToStagedUrl(stagedTarget, fileBuffer);

    // Step 3: Create file asset
    const fileId = await createFile(stagedTarget.resourceUrl, alt);

    return fileId;
  } catch (error) {
    throw new Error(
      `Failed to upload image "${filename}": ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
