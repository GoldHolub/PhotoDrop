import sharp from 'sharp';
import { ClientImagesRepository } from "../repositories/ClientImagesRepository.js";
import { FolderRepository } from "../repositories/FolderRepository.js";

export class ClientImagesService {
    private clientImagesRepository: ClientImagesRepository;
    private folderRepository: FolderRepository;

    constructor() {
        this.clientImagesRepository = new ClientImagesRepository();
        this.folderRepository = new FolderRepository();
    }
    async getAllImages(clientId: number) {
        try {
            const clientImages = await this.clientImagesRepository.findImagesByClient(clientId);
            const groupedImages = this.groupImagesByLocation(clientImages);

            return groupedImages;
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
            const isPurchased = clientImages.some(image => image.isPurchased === true);

            if (!isPurchased) {
                const watermarkedImageBuffer = await this.addWatermark(image.imageData);
                const watermarkedImageBase64 = watermarkedImageBuffer.toString('base64');
                return watermarkedImageBase64;
            }
            
            return image;
        } catch (error) {
            throw error;
        }
    }

    private async addWatermark(imageBuffer: Buffer) {
        const watermarkPath = 'uploads/PhotoDrop Logo.png'; 

        const image = sharp(imageBuffer);
        const watermark = await sharp(watermarkPath).resize(900, 450).toBuffer(); 

        const watermarkedImageBuffer = await image
            .composite([{ input: watermark, gravity: 'center' }]) 
            .toBuffer();

        return watermarkedImageBuffer;
    }

    private async groupImagesByLocation(images: { imageId: number | null, folderId: number | null }[]) {
        const groupedImages = images.reduce((acc: { [key: number]: number[] }, image) => {
            const { folderId, imageId } = image;
            if (!acc[folderId!]) {
                acc[folderId!] = [];
            }
            acc[folderId!].push(imageId!);
            return acc;
        }, {});

        const folderIds = Object.keys(groupedImages).map((id) => parseInt(id));
        const folders = await this.folderRepository.getFolderNamesByIds(folderIds);

        const groupedImagesByLocation = folders.reduce((acc: { [key: string]: number[] }, folder) => {
            const { location, id } = folder;
            if (!acc[location]) {
                acc[location] = [];
            }
            acc[location].push(...groupedImages[id]);
            return acc;
        }, {});

        const result = Object.keys(groupedImagesByLocation).map(location => ({
            "location name": location,
            "image ids": groupedImagesByLocation[location]
        }));

        return result;
    }
}