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

app.get('https://resilio-backend.onrender.com/health-check', async (_req, res) => {
    try{
        await pool.query('SELECT 1');
        res.json({ ok: true, message: 'API OK'});
    }
    catch{
        res.status(500).json({ ok: false, message: 'DB caída' });
    }
})

app.use('https://resilio-backend.onrender.com/api', userRoute);
app.use('https://resilio-backend.onrender.com/api', passwordRoute);
app.use('https://resilio-backend.onrender.com/api', refreshRoute);

app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ok: false, message: 'Error interno'});
});

export default app;