import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoute from './client/route/userRoute.js';
import passwordRoute from './client/route/recoverPasswordRoute.js';
import refreshRoute from './client/route/refreshRoute.js';
import googleRoute from './client/route/googleOauthRoute.js';
import bannerRoute from './client/route/bannerRoute.js';
import eventsRoute from './client/route/eventsRoutes.js';
import partnersRoute from './client/route/partnersRoute.js';
import pageUserAdminRoute from './admin/route/pageUserRoute.js';
import 'dotenv/config';

const app = express();

// Configuración de CORS para cookies
const allowedOrigins = [
    'http://localhost:5173', // Desarrollo local
    'http://localhost:3000', // Desarrollo alternativo
    'https://nicolasandradedesarrollosit.github.io', // GitHub Pages
    process.env.URL_FRONT // URL de producción desde variable de entorno
].filter(Boolean); // Elimina valores undefined

app.use(cors({
    origin: function (origin, callback) {
        // Permitir peticiones sin origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn('Origen bloqueado por CORS:', origin);
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true, // CRÍTICO: Permite envío de cookies
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
    maxAge: 86400 // Cache preflight por 24 horas
}));

app.use(cookieParser()); // CRÍTICO: Parsea las cookies
app.use(express.json());

// Logging middleware para debug
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
    next();
});

app.get('/health-check', async (_req, res) => {
    res.status(200).json({ ok: true, message: 'API corriendo en Render 🚀' });
})

app.use('/api', userRoute);
app.use('/api', passwordRoute);
app.use('/api', refreshRoute);
app.use('/api', googleRoute);
app.use('/api', bannerRoute);
app.use('/api', eventsRoute);
app.use('/api', partnersRoute);
app.use('/api', pageUserAdminRoute);

// Manejador de errores global - DEBE estar después de las rutas
app.use((err, req, res, next) => {
  console.error('Error en request:', {
    path: req.path,
    method: req.method,
    origin: req.headers.origin,
    body: req.body,
    error: err.message,
    stack: err.stack
  });
  
  // Asegurar que los headers CORS estén presentes incluso en errores
  const origin = req.headers.origin;
  if (origin && allowedOrigins.indexOf(origin) !== -1) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  
  res.status(500).json({ 
    ok: false, 
    message: 'Error interno del servidor' 
  });
});

export default app;