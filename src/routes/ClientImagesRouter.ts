import { Router } from 'express';
import passport from '../middleware/passport.js';
import { ClientImagesController } from '../controllers/ClientImagesController.js';

const router = Router();
const clientImagesController = new ClientImagesController();

router.get('/client/images', passport.authenticate('jwt', { session: false }), (req, res) => clientImagesController.getAllImages(req, res));
router.get('/client/image/:imageId', passport.authenticate('jwt', { session: false }), (req, res) => clientImagesController.getImageById(req, res));
//router.get('/client/albums',passport.authenticate('jwt', { session: false }), (req, res) =>clientImagesController.editClientSelfie(req, res));

export default router;