export function validateEventReq(eventData) {
    const { name, description, location, date, url_passline, url_image_event } = eventData;
    const errors = [];

    if (!name || typeof name !== 'string' || name.trim() === '') {
        errors.push('Name is required and must be a non-empty string.');
    }
    
    if (typeof name === 'string' && name.trim().length > 255) {
        errors.push('Name is too long (maximum 255 characters).');
    }
    
    if (!description || typeof description !== 'string' || description.trim() === '') {
        errors.push('Description is required and must be a non-empty string.');
    }
    
    if (typeof description === 'string' && description.trim().length > 5000) {
        errors.push('Description is too long (maximum 5000 characters).');
    }
    
    if (!location || typeof location !== 'string' || location.trim() === '') {
        errors.push('Location is required and must be a non-empty string.');
    }
    
    if (typeof location === 'string' && location.trim().length > 500) {
        errors.push('Location is too long (maximum 500 characters).');
    }
    
    if (!date || isNaN(Date.parse(date))) {
        errors.push('Date is required and must be a valid date string.');
    }
    
    if (url_passline && (typeof url_passline !== 'string' || !/^https?:\/\/.+/.test(url_passline))) {
        errors.push('URL Passline must be a valid URL if provided.');
    }
    
    if (typeof url_passline === 'string' && url_passline.length > 1000) {
        errors.push('URL Passline is too long (maximum 1000 characters).');
    }
    
    if (url_image_event && (typeof url_image_event !== 'string' || !/^https?:\/\/.+/.test(url_image_event))) {
        errors.push('URL Image must be a valid URL if provided.');
    }
    
    if (typeof url_image_event === 'string' && url_image_event.length > 1000) {
        errors.push('URL Image is too long (maximum 1000 characters).');
    }

    return {
        valid: errors.length === 0,
        message: errors.join(' ')
    };
}

export function validatePartialEventReq(eventData) {
    const { name, description, location, date, url_passline, url_image_event } = eventData;
    const errors = [];

    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
        errors.push('Name must be a non-empty string if provided.');
    }
    
    if (name !== undefined && typeof name === 'string' && name.trim().length > 255) {
        errors.push('Name is too long (maximum 255 characters).');
    }
    
    if (description !== undefined && (typeof description !== 'string' || description.trim() === '')) {
        errors.push('Description must be a non-empty string if provided.');
    }
    
    if (description !== undefined && typeof description === 'string' && description.trim().length > 5000) {
        errors.push('Description is too long (maximum 5000 characters).');
    }
    
    if (location !== undefined && (typeof location !== 'string' || location.trim() === '')) {
        errors.push('Location must be a non-empty string if provided.');
    }
    
    if (location !== undefined && typeof location === 'string' && location.trim().length > 500) {
        errors.push('Location is too long (maximum 500 characters).');
    }
    
    if (date !== undefined && isNaN(Date.parse(date))) {
        errors.push('Date must be a valid date string if provided.');
    }
    
    if (url_passline !== undefined && url_passline !== null && url_passline !== '' && (typeof url_passline !== 'string' || !/^https?:\/\/.+/.test(url_passline))) {
        errors.push('URL Passline must be a valid URL if provided.');
    }
    
    if (url_passline !== undefined && typeof url_passline === 'string' && url_passline.length > 1000) {
        errors.push('URL Passline is too long (maximum 1000 characters).');
    }
    
    if (url_image_event !== undefined && url_image_event !== null && url_image_event !== '' && (typeof url_image_event !== 'string' || !/^https?:\/\/.+/.test(url_image_event))) {
        errors.push('URL Image must be a valid URL if provided.');
    }
    
    if (url_image_event !== undefined && typeof url_image_event === 'string' && url_image_event.length > 1000) {
        errors.push('URL Image is too long (maximum 1000 characters).');
    }

    if (Object.keys(eventData).length === 0) {
        errors.push('At least one field must be provided for update.');
    }

    return {
        valid: errors.length === 0,
        message: errors.join(' ')
    };
}