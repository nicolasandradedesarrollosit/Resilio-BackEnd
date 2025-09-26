import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';

const PORT = Number(process.env.PORT || '0.0.0.0');
app.listen(PORT, () => console.log(`Servidor siendo escuchado en el puerto ${PORT}`));
