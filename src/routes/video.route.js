import express from 'express';

const router = express.Router();

router.post('/upload', uploadVideo);

export default router;
