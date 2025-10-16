import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY // Usa el service key para el backend
);

/**
 * Sube una imagen a Supabase Storage
 * @param {Object} file - Archivo de multer (req.file)
 * @param {string} bucket - Nombre del bucket (ej: 'events')
 * @returns {Promise<{url: string, path: string}>}
 */
export async function uploadToSupabase(file, bucket = 'events') {
    try {
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = `events/${fileName}`;

        // Subir archivo a Supabase Storage
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            throw error;
        }

        // Obtener URL pública
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);

        return {
            url: publicUrl,
            path: data.path
        };
    } catch (error) {
        console.error('Error subiendo a Supabase:', error);
        throw error;
    }
}

/**
 * Elimina una imagen de Supabase Storage
 * @param {string} filePath - Ruta del archivo en storage
 * @param {string} bucket - Nombre del bucket
 */
export async function deleteFromSupabase(filePath, bucket = 'events') {
    try {
        const { error } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

        if (error) {
            throw error;
        }

        return true;
    } catch (error) {
        console.error('Error eliminando de Supabase:', error);
        throw error;
    }
}
