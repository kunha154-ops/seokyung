import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import crypto from 'crypto';

export async function saveUpload(file: File, folder: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = join(process.cwd(), 'public', 'uploads', folder);
  await mkdir(uploadDir, { recursive: true });

  const originalName = file.name;
  const ext = originalName.substring(originalName.lastIndexOf('.'));
  const uniqueName = `${crypto.randomUUID()}${ext}`;
  const filePath = join(uploadDir, uniqueName);

  await writeFile(filePath, buffer);
  
  return `/uploads/${folder}/${uniqueName}`;
}
