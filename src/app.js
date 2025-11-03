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
import benefitsRoute from './client/route/myBenefitsRoute.js';
import pageUserAdminRoute from './admin/route/pageUserRoute.js';
import pageEventsRoute from './admin/route/pageEventsRoute.js';
import pageBenefitRoute from './admin/route/pageBenefitRoute.js';
import pageBusinessRoute from './admin/route/pageBusinessRoute.js';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const allowedOrigins = [
    'https://nicolasandradedesarrollosit.github.io',
    process.env.URL_FRONT 
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
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
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use((req, res, next) => {
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
app.use('/api' , benefitsRoute);
app.use('/api', pageUserAdminRoute);
app.use('/api', pageEventsRoute);
app.use('/api', pageBenefitRoute);
app.use('/api', pageBusinessRoute);

app.use((err, _req, res, next) => {
  if (err && err.message && err.message.includes('Tipo de archivo no permitido')) {
    return res.status(400).json({ 
      error: err.message 
    });
  }
  next(err);
});

app.use((err, req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.indexOf(origin) !== -1) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  
  console.error('Error interno del servidor:', err);
  res.status(500).json({ 
    ok: false, 
    message: 'Error interno del servidor' 
  });
});

export default app;