import express from 'express';
import cors from 'cors';
import userRoute from './client/route/userRoute.js';
import passwordRoute from './client/route/recoverPasswordRoute.js';
import refreshRoute from './client/route/refreshRoute.js';
import googleRoute from './client/route/googleOauthRoute.js';
import bannerRoute from './client/route/bannerRoute.js';
import eventsRoute from './client/route/eventsRoutes.js';
import partnersRoute from './client/route/partnersRoute.js';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

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

app.use((err, req, res, next) => {
  console.error('Error en request:', {
    path: req.path,
    body: req.body,
    error: err.stack
  });
  res.status(500).json({ message: 'Error interno del servidor' });
});

export default app;