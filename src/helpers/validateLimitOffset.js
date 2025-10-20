export function validateLimitOffset(limit, offset) {
    const parsedLimit = parseInt(limit, 10);
    const parsedOffset = parseInt(offset, 10);
    
    if (limit !== undefined && (isNaN(parsedLimit) || parsedLimit <= 0)) {
        return { valid: false, message: 'Limite tiene que ser un número positivo' };
    }
    if (offset !== undefined && (isNaN(parsedOffset) || parsedOffset < 0)) {
        return { valid: false, message: 'Offset tiene que ser un número no negativo' };
    }
    return { valid: true };
}

export const validateUserReq = (req) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
    return validateLimitOffset(limit, offset);
};