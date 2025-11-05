-- Script SQL para agregar campos de coordenadas a la tabla business

-- 1. Agregar columnas de latitud y longitud
ALTER TABLE business 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- 2. Agregar índice para búsquedas geoespaciales más rápidas
CREATE INDEX IF NOT EXISTS idx_business_location 
ON business(latitude, longitude);

-- 3. (Opcional) Agregar campo para indicar si las coordenadas fueron verificadas
ALTER TABLE business 
ADD COLUMN IF NOT EXISTS coordinates_verified BOOLEAN DEFAULT FALSE;

-- 4. (Opcional) Agregar timestamp de última geocodificación
ALTER TABLE business 
ADD COLUMN IF NOT EXISTS geocoded_at TIMESTAMP;

-- Ejemplo de actualización manual de coordenadas:
-- UPDATE business 
-- SET latitude = -33.4489, 
--     longitude = -70.6693, 
--     coordinates_verified = TRUE,
--     geocoded_at = NOW()
-- WHERE id = 1;
