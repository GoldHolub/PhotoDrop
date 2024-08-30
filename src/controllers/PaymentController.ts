import { Request, Response } from 'express';
import { ClientImagesService } from '../services/ClientImagesService.js';
import { PaymentService } from '../services/PaymentService.js';

export class PaymentController {
    private clientImagesService: ClientImagesService;
    private paymentService: PaymentService;

    constructor() {
        this.clientImagesService = new ClientImagesService();
        this.paymentService = new PaymentService();
    }

    async createPhotoPayment(req: Request, res: Response) {
        const imageIds: number[] = req.body.imageIds;
        const paymentMethod: string = req.body.paymentMethod;
        //@ts-ignore
        const clientId: number = req.user?.id;
        const baseUrl: string = `https://photodropapp.vercel.app`;
        //const baseUrl: string = `${req.protocol}://${req.get('host')}`;
        try {
            const sessionInfo = await this.clientImagesService.buyImagesByIds(imageIds, clientId, baseUrl, paymentMethod);
            res.status(200).json(sessionInfo);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async handleWebhookEvent(req: Request, res: Response) {
        try {
            const sig: string  | string[] = req.headers['stripe-signature']!;
            const payload = req.body;
            if (!sig) {
                return res.status(400).send('Missing Stripe signature');
            }
            this.paymentService.handleWebhookEvent(payload, sig);
            res.status(200).json({ received: true });
        } catch (error: any) {
            return res.status(400).send(`Webhook Error: ${error.message}`);
        }
    }

    async handleWebhookEventForIntend(req: Request, res: Response) {
        try {
            const sig: string  | string[] = req.headers['stripe-signature']!;
            const payload = req.body;
            if (!sig) {
                return res.status(400).send('Missing Stripe signature');
            }
            this.paymentService.handlePaymentIntentSucceeded(payload, sig);
            res.status(200).json({ received: true });
        } catch (error: any) {
            return res.status(400).send(`Webhook Error: ${error.message}`);
        }
    }
}