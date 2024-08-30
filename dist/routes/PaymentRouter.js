import { Router } from 'express';
import bodyParser from 'body-parser';
import passport from '../middleware/passport.js';
import { PaymentController } from '../controllers/PaymentController.js';
const paymentController = new PaymentController();
const router = Router();
router.post('/client/payment', passport.authenticate('jwt', { session: false }), (req, res) => paymentController.createPhotoPayment(req, res));
router.post('/client/stripe-events', bodyParser.raw({ type: 'application/json' }), async (req, res) => paymentController.handleWebhookEvent(req, res));
router.post('/client/stripe-events-intent', bodyParser.raw({ type: 'application/json' }), async (req, res) => paymentController.handleWebhookEventForIntend(req, res));
export default router;
//# sourceMappingURL=PaymentRouter.js.map