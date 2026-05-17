import express from 'express';
import { uploadVideo } from '../controllers/video.controller.js';
const router = express.Router();

router.post('/upload', uploadVideo);

export default router;
