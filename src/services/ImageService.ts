import { FolderRepository } from "../repositories/FolderRepository.js";
import { ImageRepository } from "../repositories/ImageRepository.js";
import fs from 'fs/promises';

export type ImageData = {
    name: string;
    type: string;
    folderId: number;
    photographerId: number;
}

export class ImageService {
    private folderRepository: FolderRepository;
    private imageRepository: ImageRepository;

    constructor() {
        this.folderRepository = new FolderRepository();
        this.imageRepository = new ImageRepository();
    }

    async addImagesToFolder(files: Express.Multer.File[], folderId: number, photographerId: number) {
        if (!files) {
            throw new Error(`Add image files to request`);
        }
        const folder = await this.folderRepository.getFolderByIdAndUserId(folderId, photographerId);
        if (!folder) {
            throw new Error(`Current folder does not exist or does not belong to user`);
        }

        const insertedImages = [];

        for (const file of files) {
            try {
                const imageData: ImageData = {
                    name: file.originalname,
                    type: file.mimetype,
                    folderId: folderId,
                    photographerId: photographerId
                }
                const imageBuffer = await fs.readFile(file.path);
                const savedImage = await this.imageRepository.addImageToFolder(imageData, imageBuffer);
                insertedImages.push(savedImage);
            } catch (error) {
                throw new Error(`Can't add file ${file.filename} to DB`);
            } finally {
                await fs.unlink(file.path);
            }
        }
        return insertedImages;
    }

    async getImagesFromFolder(folderId: number, photographerId: number) {
        const folder = await this.folderRepository.getFolderByIdAndUserId(folderId, photographerId);
        if (!folder) {
            throw new Error(`Current folder does not exist or does not belong to user`);
        }

        const imagesInfo = await this.imageRepository.getImagesFromFolder(folderId);
        return imagesInfo;
    }

    async getImageById(imageId: number, photographerId: number) {
        const imageData = await this.imageRepository.getImageInfoByIds([imageId], photographerId);

        if (imageData.length === 0) {
            throw new Error(`Current Image does not exist or does not belong to user`);
        }

        const image = await this.imageRepository.getImageById(imageId);
        return image;
    }

    async deleteImageByIds(imageIds: number[], photographerId: number) {
        const imageData = await this.imageRepository.getImageInfoByIds(imageIds, photographerId);

        if (imageData.length !== imageIds.length) {
            throw new Error(`No images found or images do not belong to the user`);
        }

        const deletedImage = await this.imageRepository.deleteImageByIds(imageIds);
        return deletedImage;
    }
}