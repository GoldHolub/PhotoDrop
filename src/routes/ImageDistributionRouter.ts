import { Router } from 'express';
import passport from '../middleware/passport.js';
import { ImageDistributionController } from '../controllers/ImageDistributionController.js';
import { roleCheck } from '../middleware/roleCheck.js';

const imageDistributionController = new ImageDistributionController();
const router = Router();

router.get('/admin/users', 
    passport.authenticate('jwt', { session: false }), 
    roleCheck(['photographer']),
    (req, res) => imageDistributionController.getUsers(req, res));

router.get('/admin/images', 
    passport.authenticate('jwt', { session: false }), 
    roleCheck(['photographer']),
    (req, res) => imageDistributionController.getImages(req, res));

router.get('/admin/images/users', 
    passport.authenticate('jwt', { session: false }), 
    roleCheck(['photographer']),
    (req, res) => imageDistributionController.getImagesToUsersData(req, res));

router.post('/admin/pair', 
    passport.authenticate('jwt', { session: false }), 
    roleCheck(['photographer']),
    imageDistributionController.pairImagesWithUsers);

export default router;