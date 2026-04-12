import { clerkMiddleware } from '@clerk/express';
import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import apiRoutes from './routes/index.js';

const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  }),
);
app.use(express.json());
app.use(clerkMiddleware());

app.get('/', (_request, response) => {
  response.json({
    message: 'VolunteerHub backend is running.',
  });
});

app.use('/api', apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
