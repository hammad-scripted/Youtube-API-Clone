import express from 'express';
import {
  getAllVideos,
  uploadVideo,
  updateVideo,
} from '../controllers/video.controller.js';
const router = express.Router();

router.post('/upload', uploadVideo);
router.put('/upload/:id', updateVideo);
router.get('/', getAllVideos);

export default router;
