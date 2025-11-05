// Ejemplo de cómo modificar el modelo de business para incluir coordenadas
// Este archivo es un EJEMPLO para implementación futura

import { pool } from '../../config/db.js';

export async function createBusinessWithCoordinates(businessData) {
    const { name, location, url_image_business, latitude, longitude } = businessData;
    const { rows } = await pool.query(
        `
        INSERT INTO business
        (name, location, url_image_business, latitude, longitude, geocoded_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING *
        `,
        [name, location, url_image_business, latitude, longitude]
    );
    return rows[0];
}

export async function updateBusinessCoordinates(businessId, latitude, longitude) {
    const { rows } = await pool.query(
        `
        UPDATE business
        SET latitude = $1,
            longitude = $2,
            coordinates_verified = TRUE,
            geocoded_at = NOW()
        WHERE id = $3
        RETURNING *
        `,
        [latitude, longitude, businessId]
    );
    return rows[0];
}

export async function getBusinessWithCoordinates() {
    const { rows } = await pool.query(
        `
        SELECT 
            id, 
            name, 
            location, 
            url_image_business,
            latitude,
            longitude,
            coordinates_verified,
            geocoded_at
        FROM business
        WHERE latitude IS NOT NULL 
        AND longitude IS NOT NULL
        ORDER BY id DESC
        `
    );
    return rows;
}

export async function getBusinessNeedingGeocoding() {
    const { rows } = await pool.query(
        `
        SELECT 
            id, 
            name, 
            location
        FROM business
        WHERE (latitude IS NULL OR longitude IS NULL)
        AND location IS NOT NULL
        AND location != ''
        ORDER BY id DESC
        `
    );
    return rows;
}

// Buscar negocios dentro de un radio (en kilómetros)
export async function getBusinessNearby(latitude, longitude, radiusKm = 5) {
    // Usando la fórmula Haversine para calcular distancia
    const { rows } = await pool.query(
        `
        SELECT 
            *,
            (
                6371 * acos(
                    cos(radians($1)) * 
                    cos(radians(latitude)) * 
                    cos(radians(longitude) - radians($2)) + 
                    sin(radians($1)) * 
                    sin(radians(latitude))
                )
            ) AS distance_km
        FROM business
        WHERE latitude IS NOT NULL 
        AND longitude IS NOT NULL
        HAVING distance_km <= $3
        ORDER BY distance_km
        `,
        [latitude, longitude, radiusKm]
    );
    return rows;
}
