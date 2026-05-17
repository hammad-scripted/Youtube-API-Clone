import express from 'express';
import fileUpload from 'express-fileupload';
import { protectRoute } from './middlewares/auth.middleware.js';
import userRouter from './routes/user.routes.js';
import videoRouter from './routes/video.route.js';
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Handle FormData fields

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
