"use server"

import { createClient } from '~/utils/supabase/server';

export async function uploadImage(formData: FormData) {
  const supabase = createClient();
  const file = formData.get('file') as File;

  if (!file) {
    throw new Error('File is required');
  }

  try {
    // Get file extension from original file
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    
    // Generate filename using only timestamp and extension
    const fileName = `${Date.now()}.${fileExt}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('images')
      .upload(fileName, file);

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    // Get the public URL of the uploaded file
    const { data: { publicUrl } } = supabase
      .storage
      .from('images')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error: any) {
    console.error('Error in uploadImage:', error);
    throw new Error(error.message || 'An error occurred while uploading the image');
  }
}

