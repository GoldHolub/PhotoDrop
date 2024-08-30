import Stripe from 'stripe';
import { ImageRepository } from '../repositories/ImageRepository.js';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
});

export class PaymentService {
    private imageRepository: ImageRepository;

    constructor() {
        this.imageRepository = new ImageRepository();
    }

    async createCheckoutSession(lineItems: Stripe.Checkout.SessionCreateParams.LineItem[], baseUrl: string, paymentMethod: string) {
        try {
            const payment_method = paymentMethod === 'paypal' ? 'paypal' : 'card';
            const session = await stripe.checkout.sessions.create({
                ui_mode: 'embedded',
                payment_method_types: [`${payment_method}`],
                line_items: lineItems,
                mode: 'payment',
                //success_url: 'http://localhost/success',
                //cancel_url: 'http://localhost/cancel'
                return_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`
            });
            return { sessionId: session.id, client_secret: session.client_secret };
        } catch (error: any) {
            throw new Error(`Can't create stripe checkout session: ${error.message}`);
        }
    }

    async handleWebhookEvent(payload: Buffer, sig: string | string[]) {
        try {
            const STRIPE_WEBHOOK_SECRET: string = process.env.STRIPE_WEBHOOK_SECRET!
            let event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET!);
            const session: Stripe.Checkout.Session = event.data.object as Stripe.Checkout.Session;
            if (session.payment_status !== 'paid') {
                console.log(`unpaid session: ${session.payment_status}`);
                return;
            }
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
            const imageIds = lineItems.data.map(item => {
                const imageId = parseInt(item.description!.split('#')[1], 10); // Assuming image ID is part of the name
                return imageId;
            });

            await this.imageRepository.buyImagesByIds(imageIds);
            console.log(`bot images: ${imageIds}`);
            return;
        } catch (error: any) {
            throw new Error(`Webhook signature verification failed: ${error.message}`);
        }
    }

    async createPaymentIntent(amount: number, imageIds: number[]) {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'usd',
                payment_method_types: ['card'],
                metadata: {
                    image_ids: imageIds.join(','),
                },
            });

            return { client_secret: paymentIntent.client_secret };
        } catch (error: any) {
            throw new Error(`Can't create Stripe PaymentIntent: ${error.message}`);
        }
    }

    async handlePaymentIntentSucceeded(payload: Buffer, sig: string | string[]) {
        try {
            let event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_2_SECRET!);
            const paymentIntent = event.data.object as Stripe.PaymentIntent;

            if (paymentIntent.status !== 'succeeded') {
                console.log(`Unsuccessful payment: ${paymentIntent.status}`);
                return;
            }

            const imageIdsString = paymentIntent.metadata.image_ids;
            const imageIds = imageIdsString ? imageIdsString.split(',').map(Number) : [];
            console.log(`image ids: ${imageIds}`);

            if (imageIds.length > 0) {
                await this.imageRepository.buyImagesByIds(imageIds);
                console.log(`Bought images: ${imageIds}`);
            } else {
                console.log('No image IDs found in metadata');
            }
        } catch (error: any) {
            throw new Error(`Webhook signature verification failed: ${error.message}`);
        }
    }
}