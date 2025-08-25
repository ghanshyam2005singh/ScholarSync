import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

// Disable body parsing so we can use formidable
export const config = {
  api: { bodyParser: false },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function parseFormData(req: NextApiRequest): Promise<{ fields: Record<string, string>; file: File }> {
  const form = formidable({ multiples: false });
  return new Promise((resolve, reject) => {
    form.parse(req as import('http').IncomingMessage, (err, fields, files) => {
      if (err) return reject(err);
      const file = (Array.isArray(files.file) ? files.file[0] : files.file) as File;
      const normalizedFields: Record<string, string> = {};
      for (const key in fields) {
        normalizedFields[key] = Array.isArray(fields[key])
          ? (fields[key][0] ?? '')
          : (fields[key] ?? '');
      }
      resolve({ fields: normalizedFields, file });
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { fields, file } = await parseFormData(req);
    const { title, college, category, course, semester, subject, uploaderId } = fields;
    const fileBuffer = await fs.readFile(file.filepath);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('resources')
      .upload(`${college}/${course}/Sem_${semester}/${title}-${Date.now()}-${file.originalFilename}`, fileBuffer, {
        contentType: file.mimetype ?? undefined,
        upsert: true,
      });

    if (error) throw error;

    const publicUrl = supabase.storage.from('resources').getPublicUrl(data.path).data.publicUrl;

    // Save metadata to Supabase table
    const { error: dbError } = await supabase
      .from('resources')
      .insert([{
        id: uuidv4(),
        title,
        college,
        category,
        course,
        semester,
        subject,
        uploaderId,
        drive_link: publicUrl,
        created_at: new Date().toISOString(),
        read_count: 0,
        download_count: 0,
      }]);

    if (dbError) throw dbError;

    res.status(200).json({ success: true, link: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: 'Upload failed' });
  }
}