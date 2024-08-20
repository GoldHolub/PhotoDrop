import { Router } from 'express';
import passport from '../middleware/passport.js';
import { ImageDistributionController } from '../controllers/ImageDistributionController.js';
const imageDistributionController = new ImageDistributionController();
const router = Router();
router.get('/admin/users', passport.authenticate('jwt', { session: false }), (req, res) => imageDistributionController.getUsers(req, res));
router.get('/admin/images', passport.authenticate('jwt', { session: false }), (req, res) => imageDistributionController.getImages(req, res));
router.get('/admin/images/users', passport.authenticate('jwt', { session: false }), (req, res) => imageDistributionController.getImagesToUsersData(req, res));
//router.post('/admin/pair', passport.authenticate('jwt', { session: false }), (req, res) => imageDistributionController.getImages(req, res));
export default router;
//# sourceMappingURL=ImageDistributionRouter.js.map