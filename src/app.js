import express from 'express';
import fileUpload from 'express-fileupload';
import { protectRoute } from '../middlewares/auth.middleware';
import userRouter from './routes/user.routes.js';
import videoRouter from './routes/video.route.js';
const app = express();

// Middleware
app.use(express.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  }),
);

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/videos', protectRoute, videoRouter);

export default app;
