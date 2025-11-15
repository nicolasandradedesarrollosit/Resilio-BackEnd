export function validateBenefitFields(benefitData) {
    const { name, q_of_codes, discount, id_business_discount } = benefitData;
    const errors = [];

    // Nombre es obligatorio
    if (typeof name !== 'string' || name.trim() === '') {
        errors.push('Name is required and must be a non-empty string.');
    }

    if (typeof name === 'string' && name.trim().length > 255) {
        errors.push('Name is too long (maximum 255 characters).');
    }

    // id_business_discount es obligatorio
    if (!Number.isInteger(id_business_discount) || id_business_discount <= 0) {
        errors.push('Business ID is required and must be a positive integer.');
    }

    // q_of_codes es opcional, pero si se proporciona debe ser válido
    if (q_of_codes !== undefined && q_of_codes !== null) {
        if (!Number.isInteger(q_of_codes) || q_of_codes < 0) {
            errors.push('Quantity of codes must be a non-negative integer if provided.');
        }
        if (q_of_codes > 1000000) {
            errors.push('Quantity of codes is too large (maximum 1,000,000).');
        }
    }

    // discount es opcional, pero si se proporciona debe ser válido
    if (discount !== undefined && discount !== null) {
        if (!Number.isInteger(discount) || discount < 0 || discount > 100) {
            errors.push('Discount must be an integer between 0 and 100 if provided.');
        }
    }

    return {
        valid: errors.length === 0,
        message: errors.join(' ')
    };
}

export function validatePartialBenefitFields(benefitData) {
    const { name, q_of_codes, discount, id_business_discount } = benefitData;
    const errors = [];

    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
        errors.push('Name must be a non-empty string if provided.');
    }

    if (name !== undefined && typeof name === 'string' && name.trim().length > 255) {
        errors.push('Name is too long (maximum 255 characters).');
    }

    if (q_of_codes !== undefined && (!Number.isInteger(q_of_codes) || q_of_codes < 0)) {
        errors.push('Quantity of codes must be a non-negative integer if provided.');
    }

    if (q_of_codes !== undefined && q_of_codes > 1000000) {
        errors.push('Quantity of codes is too large (maximum 1,000,000).');
    }

    if (discount !== undefined && (!Number.isInteger(discount) || discount < 0 || discount > 100)) {
        errors.push('Discount must be an integer between 0 and 100 if provided.');
    }

    if (id_business_discount !== undefined && (!Number.isInteger(id_business_discount) || id_business_discount <= 0)) {
        errors.push('Business ID must be a positive integer if provided.');
    }

    if (Object.keys(benefitData).length === 0) {
        errors.push('At least one field must be provided for update.');
    }

    return {
        valid: errors.length === 0,
        message: errors.join(' ')
    };
}