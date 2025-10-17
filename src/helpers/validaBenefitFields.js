export function validateBenefitFields(benefitData) {
    const { name, q_of_codes, discount, id_business_discount } = benefitData;
    const errors = [];

    if (typeof name !== 'string' || name.trim() === '') {
        errors.push('Name is required and must be a non-empty string.');
    }

    if (!Number.isInteger(q_of_codes) || q_of_codes < 0) {
        errors.push('Quantity of codes must be a positive integer.');
    }

    if (!Number.isInteger(discount) || discount < 0 || discount > 100) {
        errors.push('Discount must be an integer between 0 and 100.');
    }

    if (!Number.isInteger(id_business_discount) || id_business_discount <= 0) {
        errors.push('Business ID is required and must be a positive integer.');
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

    if (q_of_codes !== undefined && (!Number.isInteger(q_of_codes) || q_of_codes < 0)) {
        errors.push('Quantity of codes must be a positive integer if provided.');
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