// app.js
import express from 'express';
import claimRoutes from './api/claim/claim.route.js'
import authRoutes from './api/auth/auth.route.js'
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/claim', claimRoutes);
app.use('/api/auth', authRoutes);
app.use(errorHandler); // Catch-all error handler

export default app;
