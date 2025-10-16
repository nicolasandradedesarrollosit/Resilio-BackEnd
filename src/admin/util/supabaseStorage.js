import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY 
);

/**
 * @param {Buffer} fileBuffer
 * @param {string} originalName
 * @param {string} mimeType
 * @param {string} folder 
 * @returns {Promise<{url: string, path: string}>}
 */
export async function uploadToSupabase(fileBuffer, originalName, mimeType, folder = 'events') {
    try {
        const fileName = `${Date.now()}-${originalName}`;
        const filePath = `${folder}/${fileName}`;

        const { data, error } = await supabase.storage
            .from('Images-Events')
            .upload(filePath, fileBuffer, {
                contentType: mimeType,
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            throw error;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('Images-Resilio')
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
 * @param {string} filePath
 */
export async function deleteFromSupabase(filePath) {
    try {
        const { error } = await supabase.storage
            .from('Images-Events')
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
