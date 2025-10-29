import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY 
);


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
            .from('Images-Events')
            .getPublicUrl(data.path);

        return {
            url: publicUrl,
            path: data.path
        };
    } catch (error) {
        throw error;
    }
}


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
        throw error;
    }
}

export async function uploadToSupabaseBusiness(fileBuffer, originalName, mimeType, folder = 'business') {
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
            .from('Images-Events')
            .getPublicUrl(data.path);

        return {
            url: publicUrl,
            path: data.path
        };
    } catch (error) {
        throw error;
    }
}


export async function deleteFromSupabaseBusiness(filePath) {
    try {
        const { error } = await supabase.storage
            .from('Images-Events')
            .remove([filePath]);

        if (error) {
            throw error;
        }

        return true;
    } catch (error) {
        throw error;
    }
}