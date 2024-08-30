import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import bodyParser from 'body-parser';
import authRoutes from './routes/AuthRouter.js';
import './middleware/passport.js';
import otpRouter from './routes/OtpRoutes.js';
import folderRouter from './routes/FolderRouter.js';
import imageRouter from './routes/ImageRouter.js';
import clientRouter from './routes/ClientRouter.js';
import clientImagesRouter from './routes/ClientImagesRouter.js';
import imageDistributionRouter from './routes/ImageDistributionRouter.js';
import paymentRouter from './routes/PaymentRouter.js';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use('/client/stripe-events', express.raw({ type: 'application/json' }));
app.use('/client/stripe-events-intent', express.raw({ type: 'application/json' }));
app.use(bodyParser.json());
app.use(passport.initialize());

app.use(authRoutes);
app.use(otpRouter);
app.use(folderRouter);
app.use(imageRouter);
app.use(clientRouter);
app.use(clientImagesRouter);
app.use(imageDistributionRouter);
app.use(paymentRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});