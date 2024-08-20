import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import passport from 'passport';
import authRoutes from './routes/AuthRouter.js';
import './middleware/passport.js';
import otpRouter from './routes/OtpRoutes.js';
import folderRouter from './routes/FolderRouter.js';
import imageRouter from './routes/ImageRouter.js';
import clientRouter from './routes/ClientRouter.js';
import clientImagesRouter from './routes/ClientImagesRouter.js';
import imageDistributionRouter from './routes/ImageDistributionRouter.js';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(authRoutes);
app.use(otpRouter);
app.use(folderRouter);
app.use(imageRouter);
app.use(clientRouter);
app.use(clientImagesRouter);
app.use(imageDistributionRouter);
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
//# sourceMappingURL=server.js.map