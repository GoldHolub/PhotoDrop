import { Router } from 'express';
import { FolderController } from '../controllers/FolderController.js';
import passport from '../middleware/passport.js';

const folderController = new FolderController();

const router = Router();

router.post('/folders', passport.authenticate('jwt', { session: false }), (req, res) => folderController.createFolder(req, res));
router.get('/folders', passport.authenticate('jwt', { session: false }), (req, res) => folderController.getFolders(req, res));
router.delete('/folders/:id', passport.authenticate('jwt', { session: false }), (req, res) => folderController.deleteFolderById(req, res));

export default router;