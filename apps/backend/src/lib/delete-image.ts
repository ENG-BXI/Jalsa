import fs from 'node:fs/promises';

export async function deleteImage(imagePath?: string): Promise<void> {
  if (!imagePath) return;
  const normalizedPath = imagePath.replaceAll('\\', '/');
  try {
    await fs.unlink(normalizedPath);
  } catch (error) {
    throw new Error(`Failed to delete image at ${normalizedPath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
