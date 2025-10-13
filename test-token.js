import jwt from 'jsonwebtoken';

const testUser = {
    id: '123456',
};

const JWT_SECRET = 'tu-secret-de-prueba';

const payload = {
    sub: testUser.id,
};

const options = {
    expiresIn: '15m',
};

const token = jwt.sign(payload, JWT_SECRET, options);

console.log('Token generado:', token);
console.log('\n--- Decodificado ---');

const decoded = jwt.decode(token);
console.log('Payload completo:', JSON.stringify(decoded, null, 2));
console.log('\nCampos importantes:');
console.log('- sub (userId):', decoded.sub);
console.log('- iat (issued at):', decoded.iat, '→', new Date(decoded.iat * 1000).toISOString());
console.log('- exp (expires at):', decoded.exp, '→', new Date(decoded.exp * 1000).toISOString());

const now = Math.floor(Date.now() / 1000);
console.log('\nTiempo actual:', now);
console.log('¿Token válido?', decoded.exp > now);
console.log('Tiempo restante (minutos):', Math.floor((decoded.exp - now) / 60));
