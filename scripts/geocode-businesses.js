// Script de Node.js para geocodificar todos los negocios existentes
// Uso: node scripts/geocode-businesses.js

import { pool } from '../src/config/db.js';

// Función para geocodificar una dirección usando Nominatim
async function geocodeAddress(location) {
    try {
        const searchQuery = location.toLowerCase().includes('chile') 
            ? location 
            : `${location}, Chile`;

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
            {
                headers: {
                    'User-Agent': 'Resilio-Backend-Geocoding-Script'
                }
            }
        );

        if (!response.ok) {
            throw new Error('Error en la geocodificación');
        }

        const data = await response.json();

        if (data && data.length > 0) {
            return {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
                success: true
            };
        } else {
            return {
                success: false,
                error: 'No se encontraron coordenadas'
            };
        }
    } catch (error) {
        console.error(`Error geocodificando ${location}:`, error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Función principal
async function geocodeAllBusinesses() {
    console.log('🚀 Iniciando geocodificación de negocios...\n');

    try {
        // Obtener todos los negocios que necesitan geocodificación
        const { rows: businesses } = await pool.query(`
            SELECT id, name, location 
            FROM business 
            WHERE location IS NOT NULL 
            AND location != ''
            AND (latitude IS NULL OR longitude IS NULL)
            ORDER BY id
        `);

        console.log(`📍 Se encontraron ${businesses.length} negocios para geocodificar\n`);

        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        for (let i = 0; i < businesses.length; i++) {
            const business = businesses[i];
            console.log(`[${i + 1}/${businesses.length}] Geocodificando: ${business.name} - ${business.location}`);

            const result = await geocodeAddress(business.location);

            if (result.success) {
                // Actualizar la base de datos con las coordenadas
                await pool.query(
                    `UPDATE business 
                     SET latitude = $1, 
                         longitude = $2, 
                         coordinates_verified = TRUE,
                         geocoded_at = NOW()
                     WHERE id = $3`,
                    [result.latitude, result.longitude, business.id]
                );

                console.log(`✅ Éxito: Lat ${result.latitude}, Lng ${result.longitude}\n`);
                successCount++;
            } else {
                console.log(`❌ Error: ${result.error}\n`);
                errorCount++;
                errors.push({
                    id: business.id,
                    name: business.name,
                    location: business.location,
                    error: result.error
                });
            }

            // Delay de 1 segundo entre peticiones (política de Nominatim)
            if (i < businesses.length - 1) {
                console.log('⏳ Esperando 1 segundo...\n');
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        // Resumen
        console.log('\n' + '='.repeat(50));
        console.log('📊 RESUMEN DE GEOCODIFICACIÓN');
        console.log('='.repeat(50));
        console.log(`✅ Exitosos: ${successCount}`);
        console.log(`❌ Errores: ${errorCount}`);
        console.log(`📍 Total procesados: ${businesses.length}`);

        if (errors.length > 0) {
            console.log('\n❌ Negocios con errores:');
            errors.forEach(err => {
                console.log(`  - ID ${err.id}: ${err.name} (${err.location})`);
                console.log(`    Error: ${err.error}`);
            });
        }

        console.log('\n✨ Proceso completado!\n');

    } catch (error) {
        console.error('❌ Error general:', error);
    } finally {
        await pool.end();
    }
}

// Ejecutar el script
geocodeAllBusinesses();
