import 'dotenv/config';
import cors from 'cors'
import express from 'express';
import { connectDb } from './db/index.js';
import routes from './routes/index.js';

const app = express();
app.use(cors())
app.use(express.json());


app.use('/api', routes);

// global error handler
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: { code: err.code || 'internal', message: err.message || 'Internal error' } });
});

await connectDb();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API listening on :${port}`));
