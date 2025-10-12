export function validateUserReq(req) {
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    
    if (req.query.limit !== undefined && (isNaN(limit) || limit <= 0)) {
        return { valid: false, message: 'Limite tiene que ser un número positivo' };
    }
    if (req.query.offset !== undefined && (isNaN(offset) || offset < 0)) {
        return { valid: false, message: 'Offset tiene que ser un número no negativo' };
    }
    return { valid: true };
}