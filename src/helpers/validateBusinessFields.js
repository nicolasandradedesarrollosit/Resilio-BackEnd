export function validateBusinessFields(businessData) {
    const { name, location, url_image_business } = businessData;

    if (!name || typeof name !== 'string') {
        return { valid: false, message: 'Nombre de negocio inválido.' };
    }

    if (!location || typeof location !== 'string') {
        return { valid: false, message: 'Ubicación de negocio inválida.' };
    }

    if (url_image_business && typeof url_image_business !== 'string') {
        return { valid: false, message: 'URL de imagen de negocio inválida.' };
    }

    return { valid: true };
}

export function validatePartialBusinessFields(businessData) {
    const { name, location, url_image_business } = businessData;
    const errors = [];
    
    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
        errors.push('El nombre del negocio debe ser una cadena no vacía si se proporciona.');
    }

    if (location !== undefined && (typeof location !== 'string' || location.trim() === '')) {
        errors.push('La ubicación del negocio debe ser una cadena no vacía si se proporciona.');
    }

    if (url_image_business !== undefined && typeof url_image_business !== 'string') {
        errors.push('La URL de la imagen del negocio debe ser una cadena si se proporciona.');
    }

    if (Object.keys(businessData).length === 0) {
        errors.push('Se debe proporcionar al menos un campo para actualizar.');
    }

    return {
        valid: errors.length === 0,
        message: errors.join(' ')
    };
}