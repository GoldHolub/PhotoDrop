import { Router } from 'express';
import passport from '../middleware/passport.js';
import { ClientController } from '../controllers/ClientController.js';
import multer from 'multer';
const router = Router();
const upload = multer({ dest: 'uploads/' });
const clientController = new ClientController();
router.put('/client/editName', passport.authenticate('jwt', { session: false }), (req, res) => clientController.editClientName(req, res));
router.put('/client/editSelfie', upload.array('images'), passport.authenticate('jwt', { session: false }), (req, res) => clientController.editClientSelfie(req, res));
router.put('/client/editEmail', passport.authenticate('jwt', { session: false }), (req, res) => clientController.editClientEmail(req, res));
router.get('/client/info', passport.authenticate('jwt', { session: false }), (req, res) => clientController.getClientInfo(req, res));
export default router;
//# sourceMappingURL=ClientRouter.js.map