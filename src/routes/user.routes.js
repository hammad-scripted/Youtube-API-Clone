import express from 'express';
import bcrypt from 'bcrypt';
import cloudinary from '../lib/cloudinary.js';
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import { signup } from '../controllers/user.controller.js';
import { login } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

export default router;
