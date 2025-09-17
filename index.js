import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import loginRoute from './src/client/route/loginRoute.js';
import registerRoute from './src/client/route/registerRoute.js'

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', loginRoute);
app.use('/api', registerRoute);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        ok: false,
        message: 'Error interno del servidor'
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});