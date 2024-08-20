import { Request, Response } from 'express';
import { ImageService } from '../services/ImageService.js';
import { and } from 'drizzle-orm';

export class ImageController {
    async addImagesToFolder(req: Request, res: Response) {
        const imageService = new ImageService();
        try {
            const folderId = parseInt(req.params.id);
            // @ts-ignore
            const photographerId = req.user?.id;
            const files = req.files as Express.Multer.File[];
            const answer = await imageService.addImagesToFolder(files, folderId, photographerId);
            return res.status(201).json(answer);
        } catch (error) {
            // @ts-ignore
            return res.status(500).json({ error: error.message });
        }
    }

    async getImagesFromFolder(req: Request, res: Response) {
        const imageService = new ImageService();
        try {
            const folderId = parseInt(req.params.id);
            // @ts-ignore
            const photographerId = req.user?.id;
            const imagesInfo = await imageService.getImagesFromFolder(folderId, photographerId);
            return res.status(200).json({ images: imagesInfo });
        } catch (error) {
            // @ts-ignore
            return res.status(500).json({ error: error.message });
        }
    }

    async getImageById(req: Request, res: Response) {
        const imageService = new ImageService();
        try {
            const imageId =  parseInt(req.params.imageId);
            // @ts-ignore
            const photographerId = req.user?.id;
            const imageInfo = await imageService.getImageById(imageId, photographerId);
            return res.status(200).json({ images: imageInfo });
        } catch (error) {
            // @ts-ignore
            return res.status(500).json({ error: error.message });
        }
    }

    async deleteImageByIds(req: Request, res: Response) {
        const imageService = new ImageService();
        try {
            const imageIds: number[] =  req.body.ids;
            // @ts-ignore
            const photographerId = req.user?.id;
            const deletedImage = await imageService.deleteImageByIds(imageIds, photographerId);
            return res.status(200).json({ images: deletedImage });
        } catch (error) {
            // @ts-ignore
            return res.status(500).json({ error: error.message });
        }
    }
}