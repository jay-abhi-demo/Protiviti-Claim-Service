// app.js
import express from 'express';
import claimRoutes from './api/claim/claim.route.js'
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/claim', claimRoutes);
app.use(errorHandler); // Catch-all error handler

export default app;
