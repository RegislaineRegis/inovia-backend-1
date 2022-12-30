import compression from 'compression';
import express from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import { corsMiddleware, errorHandlerMiddleware } from './middlewares';
import rootRoute from './routes';

const app = express();

// parsing json body
app.use(express.json());

// parsing url's
app.use(express.urlencoded({ extended: true }));

// compress responses
app.use(compression({ threshold: 0 }));

// apply basic security in api
app.use(helmet());

// disable cors, that should be managed by nginx
app.use(corsMiddleware);

// put routes in application
app.use(rootRoute);

// add error handler middleware
app.use(errorHandlerMiddleware);

export default app;
