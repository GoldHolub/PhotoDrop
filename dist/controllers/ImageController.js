import { ImageService } from '../services/ImageService.js';
export class ImageController {
    async addImagesToFolder(req, res) {
        const imageService = new ImageService();
        try {
            const folderId = parseInt(req.params.id);
            // @ts-ignore
            const photographerId = req.user?.id;
            const files = req.files;
            const answer = await imageService.addImagesToFolder(files, folderId, photographerId);
            return res.status(201).json(answer);
        }
        catch (error) {
            // @ts-ignore
            return res.status(500).json({ error: error.message });
        }
    }
    async getImagesFromFolder(req, res) {
        const imageService = new ImageService();
        try {
            const folderId = parseInt(req.params.id);
            // @ts-ignore
            const photographerId = req.user?.id;
            const imagesInfo = await imageService.getImagesFromFolder(folderId, photographerId);
            return res.status(200).json({ images: imagesInfo });
        }
        catch (error) {
            // @ts-ignore
            return res.status(500).json({ error: error.message });
        }
    }
    async getImageById(req, res) {
        const imageService = new ImageService();
        try {
            const imageId = parseInt(req.params.imageId);
            // @ts-ignore
            const photographerId = req.user?.id;
            const imageInfo = await imageService.getImageById(imageId, photographerId);
            return res.status(200).json({ imageInfo });
        }
        catch (error) {
            // @ts-ignore
            return res.status(500).json({ error: error.message });
        }
    }
    async deleteImageByIds(req, res) {
        const imageService = new ImageService();
        try {
            const imageIds = req.body.ids;
            // @ts-ignore
            const photographerId = req.user?.id;
            const deletedImage = await imageService.deleteImageByIds(imageIds, photographerId);
            return res.status(200).json({ images: deletedImage });
        }
        catch (error) {
            // @ts-ignore
            return res.status(500).json({ error: error.message });
        }
    }
}
//# sourceMappingURL=ImageController.js.map