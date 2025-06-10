import express from 'express';
import { handleLogin } from './auth.controller.js';
const router = express.Router();

router.post('/login', handleLogin);

export default router;
