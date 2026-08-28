import { getSupabaseClient } from './client';

export interface UploadImageResult {
  publicUrl: string;
  path: string;
}

export async function uploadImage(bucket: string, path: string, file: Blob): Promise<UploadImageResult> {
  const client = getSupabaseClient();
  const { error } = await client.storage.from(bucket).upload(path, file, {
    contentType: file.type || 'image/jpeg',
    upsert: false,
  });
  if (error) throw error;

  const { data } = client.storage.from(bucket).getPublicUrl(path);
  return { publicUrl: data.publicUrl, path };
}

export async function deleteImage(bucket: string, path: string): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await client.storage.from(bucket).remove([path]);
  if (error) throw error;
}
