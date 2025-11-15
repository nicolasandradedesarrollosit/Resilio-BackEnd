export function validateBusinessFields(businessData) {
    const { name, location, url_image_business } = businessData;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return { valid: false, message: 'Nombre de negocio inválido.' };
    }

    if (name.trim().length > 255) {
        return { valid: false, message: 'Nombre de negocio demasiado largo (máximo 255 caracteres).' };
    }

    if (!location || typeof location !== 'string' || location.trim().length === 0) {
        return { valid: false, message: 'Ubicación de negocio inválida.' };
    }

    if (location.trim().length > 500) {
        return { valid: false, message: 'Ubicación de negocio demasiado larga (máximo 500 caracteres).' };
    }

    if (url_image_business !== undefined && url_image_business !== null) {
        if (typeof url_image_business !== 'string') {
            return { valid: false, message: 'URL de imagen de negocio inválida.' };
        }
        
        if (url_image_business.trim().length > 1000) {
            return { valid: false, message: 'URL de imagen demasiado larga (máximo 1000 caracteres).' };
        }
    }

    return { valid: true };
}

export function validatePartialBusinessFields(businessData) {
    const { name, location, url_image_business } = businessData;
    const errors = [];
    
    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
        errors.push('El nombre del negocio debe ser una cadena no vacía si se proporciona.');
    }

    if (name !== undefined && name.trim().length > 255) {
        errors.push('El nombre del negocio es demasiado largo (máximo 255 caracteres).');
    }

    if (location !== undefined && (typeof location !== 'string' || location.trim() === '')) {
        errors.push('La ubicación del negocio debe ser una cadena no vacía si se proporciona.');
    }

    if (location !== undefined && location.trim().length > 500) {
        errors.push('La ubicación del negocio es demasiado larga (máximo 500 caracteres).');
    }

    if (url_image_business !== undefined && typeof url_image_business !== 'string') {
        errors.push('La URL de la imagen del negocio debe ser una cadena si se proporciona.');
    }

    if (url_image_business !== undefined && typeof url_image_business === 'string' && url_image_business.trim().length > 1000) {
        errors.push('La URL de la imagen es demasiado larga (máximo 1000 caracteres).');
    }

    if (Object.keys(businessData).length === 0) {
        errors.push('Se debe proporcionar al menos un campo para actualizar.');
    }

    return {
        valid: errors.length === 0,
        message: errors.join(' ')
    };
}