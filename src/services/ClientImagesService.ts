import sharp from 'sharp';
import Stripe from 'stripe';
import { ClientImagesRepository } from "../repositories/ClientImagesRepository.js";
import { FolderRepository } from "../repositories/FolderRepository.js";
import { ImageRepository } from '../repositories/ImageRepository.js';
import { PaymentService } from './PaymentService.js';
import { images } from '../drizzle/schema.js';

export class ClientImagesService {
    private clientImagesRepository: ClientImagesRepository;
    private folderRepository: FolderRepository;
    private imageRepository: ImageRepository;
    private paymentService: PaymentService;

    constructor() {
        this.clientImagesRepository = new ClientImagesRepository();
        this.folderRepository = new FolderRepository();
        this.imageRepository = new ImageRepository();
        this.paymentService = new PaymentService();
    }
    async getAllImagesAndBuyFirst(clientId: number) {
        try {
            const clientImages = await this.clientImagesRepository.findImagesByClient(clientId);
            const groupedImages = await this.groupImagesByLocation(clientImages);

            const image = await this.buyFirstImagesByDefault(groupedImages);

            return groupedImages;
        } catch (error) {
            throw error;
        }
    }

    private async buyFirstImagesByDefault(groupedImages: {
        location: string; images: {
            id: number;
            isPurchased: boolean;
            date: Date | null;
        }[];
    }[]) {
        try {
            const firstImageIds = groupedImages.map(group => group.images[0].id);
            const image =  await this.imageRepository.buyImagesByIds(firstImageIds);
            return image
        } catch (error) {
            throw error;
        }
    }

    async getImageById(imageId: number, clientId: number) {
        try {
            const clientImages = await this.clientImagesRepository.findImagesByClient(clientId);
            const imageBelongsToClient = clientImages.some(image => image.imageId === imageId);

            if (!imageBelongsToClient) {
                throw new Error('Image not found or does not belong to the user');
            }

            const image = await this.clientImagesRepository.getImageById(imageId);
            const isPurchased = clientImages.some(currentImage => currentImage.imageId === image.id && currentImage.isPurchased === true);

            if (!isPurchased) {
                const watermarkedImageBuffer = await this.addWatermark(image.imageData);
                return {
                    id: image.id,
                    imageData: watermarkedImageBuffer,
                    imageInfoId: image.id
                };
            }

            return image;
        } catch (error) {
            throw error;
        }
    }

    async buyImagesByIds(imageIds: number[], clientId: number, baseUrl: string, paymentMethod: string) {
        try {
            const checkedImages = await this.getCheckedImages(imageIds, clientId);
            if (paymentMethod !== 'apple-pay' && paymentMethod !== 'google-pay') {
                const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = checkedImages.map(image => ({
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Image #${image.imageId}`,
                        },
                        unit_amount: 100, // Assuming each image is $1.00
                    },
                    quantity: 1,
                }));
    
                const clientSecret = await this.paymentService.createCheckoutSession(lineItems, baseUrl, paymentMethod);
                return clientSecret;

            } else {
                const imageIds = checkedImages.map(image => image.imageId!);
                const clientSecret = await this.paymentService.createPaymentIntent(checkedImages.length * 100, imageIds);
                return clientSecret;
            }
            
        } catch (error: any) {
            throw new Error(`Can't buy images. ${error.message}`)
        }

    }

    private async getCheckedImages(imageIds: number[], clientId: number) {
        if (!imageIds || imageIds.length === 0) throw new Error('Please provide ids to buy');

        const clientImages = await this.clientImagesRepository.findImagesByClient(clientId);
        const checkedImages = clientImages
            .filter(image => imageIds.includes(image.imageId!) && !image.isPurchased);

        if (checkedImages.length !== imageIds.length) {
            throw new Error('One or more images are either not owned by the client or already purchased.');
        }

        return checkedImages;
    }

    private async addWatermark(imageBuffer: Buffer) {
        const watermarkPath = 'uploads/PhotoDropLogo.png';

        const image = sharp(imageBuffer);
        const imageMetadata = await image.metadata();
        const watermark = await sharp(watermarkPath).resize({
            // width: Math.min(800, imageMetadata.width!),
            // height: Math.min(400, imageMetadata.height!),
            width: Math.round(imageMetadata.width!/3),
            height: Math.round(imageMetadata.width!/6),
            fit: 'inside',
            withoutEnlargement: true
        }).toBuffer();

        const watermarkedImageBuffer = await image
            .composite([{ input: watermark, gravity: 'center' }])
            .toBuffer();
        return watermarkedImageBuffer;
    }

    private async groupImagesByLocation(images: { imageId: number | null, folderId: number | null, isPurchased: boolean | null, date: Date | null }[]) {
        const groupedImages = images.reduce((acc: { [key: number]: { id: number, isPurchased: boolean, date: Date | null }[] }, image) => {
            const { folderId, imageId, isPurchased, date } = image;
            if (!acc[folderId!]) {
                acc[folderId!] = [];
            }
            acc[folderId!].push({ id: imageId!, isPurchased: isPurchased!, date: date });
            return acc;
        }, {});

        const folderIds = Object.keys(groupedImages).map((id) => parseInt(id));
        const folders = await this.folderRepository.getFolderNamesByIds(folderIds);

        const groupedImagesByLocation = folders.reduce((acc: { [key: string]: { id: number, isPurchased: boolean, date: Date | null }[] }, folder) => {
            const { location, id } = folder;
            if (!acc[location]) {
                acc[location] = [];
            }
            acc[location].push(...groupedImages[id]);
            return acc;
        }, {});

        Object.keys(groupedImagesByLocation).forEach(location => {
            groupedImagesByLocation[location].sort((a, b) => {
                if (a.date && b.date) {
                    return a.date.getTime() - b.date.getTime();
                }
                return 0;
            });
        });

        const result = Object.keys(groupedImagesByLocation).map(location => ({
            location: location,
            images: groupedImagesByLocation[location]
        }));

        return result;
    }
}