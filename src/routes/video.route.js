import express from 'express';
import { uploadVideo, updateVideo } from '../controllers/video.controller.js';
const router = express.Router();

router.post('/upload', uploadVideo);
router.put('/upload/:id', updateVideo);

export default router;
