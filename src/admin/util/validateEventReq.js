export function validateEventReq(eventData) {
    const { name, description, location, date, url_passline, url_image } = eventData;
    const errors = [];

    if (!name || typeof name !== 'string' || name.trim() === '') {
        errors.push('Name is required and must be a non-empty string.');
    }
    if (!description || typeof description !== 'string' || description.trim() === '') {
        errors.push('Description is required and must be a non-empty string.');
    }
    if (!location || typeof location !== 'string' || location.trim() === '') {
        errors.push('Location is required and must be a non-empty string.');
    }
    if (!date || isNaN(Date.parse(date))) {
        errors.push('Date is required and must be a valid date string.');
    }
    if (url_passline && (typeof url_passline !== 'string' || !/^https?:\/\/.+/.test(url_passline))) {
        errors.push('URL Passline must be a valid URL if provided.');
    }
    if (url_image && (typeof url_image !== 'string' || !/^https?:\/\/.+/.test(url_image))) {
        errors.push('URL Image must be a valid URL if provided.');
    }

    return {
        valid: errors.length === 0,
        message: errors.join(' ')
    };
}

export function validatePartialEventReq(eventData) {
    const { name, description, location, date, url_passline, url_image } = eventData;
    const errors = [];

    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
        errors.push('Name must be a non-empty string if provided.');
    }
    if (description !== undefined && (typeof description !== 'string' || description.trim() === '')) {
        errors.push('Description must be a non-empty string if provided.');
    }
    if (location !== undefined && (typeof location !== 'string' || location.trim() === '')) {
        errors.push('Location must be a non-empty string if provided.');
    }
    if (date !== undefined && isNaN(Date.parse(date))) {
        errors.push('Date must be a valid date string if provided.');
    }
    if (url_passline !== undefined && (typeof url_passline !== 'string' || !/^https?:\/\/.+/.test(url_passline))) {
        errors.push('URL Passline must be a valid URL if provided.');
    }
    if (url_image !== undefined && (typeof url_image !== 'string' || !/^https?:\/\/.+/.test(url_image))) {
        errors.push('URL Image must be a valid URL if provided.');
    }

    if (Object.keys(eventData).length === 0) {
        errors.push('At least one field must be provided for update.');
    }

    return {
        valid: errors.length === 0,
        message: errors.join(' ')
    };
}