import { Router } from 'express';
import passport from '../middleware/passport.js';
import multer from 'multer';
import { ImageController } from '../controllers/ImageController.js';
import { roleCheck } from '../middleware/roleCheck.js';
const router = Router();
const upload = multer({ dest: 'uploads/' });
const imageController = new ImageController();
router.post('/folders/:id/images', upload.array('images'), passport.authenticate('jwt', { session: false }), roleCheck(['photographer']), (req, res) => imageController.addImagesToFolder(req, res));
router.get('/folders/:id/images', passport.authenticate('jwt', { session: false }), roleCheck(['photographer']), (req, res) => imageController.getImagesFromFolder(req, res));
router.get('/folders/images/:imageId', passport.authenticate('jwt', { session: false }), roleCheck(['photographer']), (req, res) => imageController.getImageById(req, res));
router.delete('/images', passport.authenticate('jwt', { session: false }), roleCheck(['photographer']), (req, res) => imageController.deleteImageByIds(req, res));
//roleCheck(['photographer', 'client'])
export default router;
//# sourceMappingURL=ImageRouter.js.map