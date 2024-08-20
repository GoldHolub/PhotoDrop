import sharp from 'sharp';
import { ClientImagesRepository } from "../repositories/ClientImagesRepository.js";
import { FolderRepository } from "../repositories/FolderRepository.js";
export class ClientImagesService {
    clientImagesRepository;
    folderRepository;
    constructor() {
        this.clientImagesRepository = new ClientImagesRepository();
        this.folderRepository = new FolderRepository();
    }
    async getAllImages(clientId) {
        try {
            const clientImages = await this.clientImagesRepository.findImagesByClient(clientId);
            const groupedImages = this.groupImagesByLocation(clientImages);
            return groupedImages;
        }
        catch (error) {
            throw error;
        }
    }
    async getImageById(imageId, clientId) {
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
        }
        catch (error) {
            throw error;
        }
    }
    async addWatermark(imageBuffer) {
        const watermarkPath = 'uploads/PhotoDrop Logo.png';
        const image = sharp(imageBuffer);
        const watermark = await sharp(watermarkPath).resize(900, 450).toBuffer();
        const watermarkedImageBuffer = await image
            .composite([{ input: watermark, gravity: 'center' }])
            .toBuffer();
        return watermarkedImageBuffer;
    }
    async groupImagesByLocation(images) {
        const groupedImages = images.reduce((acc, image) => {
            const { folderId, imageId } = image;
            if (!acc[folderId]) {
                acc[folderId] = [];
            }
            acc[folderId].push(imageId);
            return acc;
        }, {});
        const folderIds = Object.keys(groupedImages).map((id) => parseInt(id));
        const folders = await this.folderRepository.getFolderNamesByIds(folderIds);
        const groupedImagesByLocation = folders.reduce((acc, folder) => {
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
//# sourceMappingURL=ClientImagesService.js.map