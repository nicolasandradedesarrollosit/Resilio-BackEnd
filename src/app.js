import express from 'express';
import cors from 'cors';
import { pool } from './others/config/db.js';
import userRoute from './client/route/userRoute.js';
import passwordRoute from './client/route/recoverPasswordRoute.js';
import refreshRoute from './client/route/refreshRoute.js';
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

app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ok: false, message: 'Error interno'});
});

export default app;