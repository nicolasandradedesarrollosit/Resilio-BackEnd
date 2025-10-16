import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoute from './client/route/userRoute.js';
import passwordRoute from './client/route/recoverPasswordRoute.js';
import refreshRoute from './client/route/refreshRoute.js';
import googleRoute from './client/route/googleOauthRoute.js';
import bannerRoute from './client/route/bannerRoute.js';
import eventsRoute from './client/route/eventsRoutes.js';
import partnersRoute from './client/route/partnersRoute.js';
import pageUserAdminRoute from './admin/route/pageUserRoute.js';
import pageEventsRoute from './admin/route/pageEventsRoute.js';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000', 
    'https://nicolasandradedesarrollosit.github.io',
    process.env.URL_FRONT 
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn('Origen bloqueado por CORS:', origin);
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true, 
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
    maxAge: 86400 
}));

app.use(cookieParser()); 
app.use(express.json({ limit: '10mb' })); // Aumentar límite para imágenes en base64
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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
app.use('/api', pageEventsRoute);

// Middleware para manejar errores personalizados
app.use((err, req, res, next) => {
  if (err && err.message && err.message.includes('Tipo de archivo no permitido')) {
    return res.status(400).json({ 
      error: err.message 
    });
  }
  next(err);
});

app.use((err, req, res, next) => {
  console.error('Error en request:', {
    path: req.path,
    method: req.method,
    origin: req.headers.origin,
    body: req.body,
    error: err.message,
    stack: err.stack
  });
  
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