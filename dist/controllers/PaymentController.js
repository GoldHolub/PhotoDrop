import { ClientImagesService } from '../services/ClientImagesService.js';
import { PaymentService } from '../services/PaymentService.js';
export class PaymentController {
    clientImagesService;
    paymentService;
    constructor() {
        this.clientImagesService = new ClientImagesService();
        this.paymentService = new PaymentService();
    }
    async createPhotoPayment(req, res) {
        const imageIds = req.body.imageIds;
        const paymentMethod = req.body.paymentMethod;
        //@ts-ignore
        const clientId = req.user?.id;
        const baseUrl = `https://photodropapp.vercel.app`;
        //const baseUrl: string = `${req.protocol}://${req.get('host')}`;
        try {
            const sessionInfo = await this.clientImagesService.buyImagesByIds(imageIds, clientId, baseUrl, paymentMethod);
            res.status(200).json(sessionInfo);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async handleWebhookEvent(req, res) {
        try {
            const sig = req.headers['stripe-signature'];
            const payload = req.body;
            if (!sig) {
                return res.status(400).send('Missing Stripe signature');
            }
            this.paymentService.handleWebhookEvent(payload, sig);
            res.status(200).json({ received: true });
        }
        catch (error) {
            return res.status(400).send(`Webhook Error: ${error.message}`);
        }
    }
    async handleWebhookEventForIntend(req, res) {
        try {
            const sig = req.headers['stripe-signature'];
            const payload = req.body;
            if (!sig) {
                return res.status(400).send('Missing Stripe signature');
            }
            this.paymentService.handlePaymentIntentSucceeded(payload, sig);
            res.status(200).json({ received: true });
        }
        catch (error) {
            return res.status(400).send(`Webhook Error: ${error.message}`);
        }
    }
}
//# sourceMappingURL=PaymentController.js.map