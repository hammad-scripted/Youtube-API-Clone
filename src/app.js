import express from 'express';
import fileUpload from 'express-fileupload';

import userRouter from './routes/user.routes.js';

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

export default app;
