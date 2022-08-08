import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './controllers/errorController';
import wrongRouteHandler from './utils/wrongRouteHandler';
// Routers
import propertyRouter from './routes/propertyRoute';
import userRouter from './routes/userRoute';
import roomRouter from './routes/roomRoute';

// Create server
const app = express();

// Middlewars
// - security
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(
  hpp({
    whitelist: [
      // define parameters here
      'price',
    ],
  })
);

app.use(
  '/',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many request from this IP, please try again after 15 minutes',
  })
);
// - logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// - request.body & request.cookies
app.use(express.json());
app.use(cookieParser());
// ROUTES
app.use('/api/v1/properties', propertyRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/rooms', roomRouter);

// WRONG ROUTE HANDLER
app.all('*', wrongRouteHandler);

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
