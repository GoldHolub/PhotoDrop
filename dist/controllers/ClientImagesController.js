import { ClientImagesService } from '../services/ClientImagesService.js';
export class ClientImagesController {
    clientImagesService;
    constructor() {
        this.clientImagesService = new ClientImagesService();
    }
    async getAllImages(req, res) {
        // @ts-ignore
        const clientId = req.user?.id;
        try {
            const images = await this.clientImagesService.getAllImages(clientId);
            res.status(200).json(images);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async getImageById(req, res) {
        try {
            // @ts-ignore
            const clientId = req.user?.id;
            const imageId = parseInt(req.params.imageId);
            const image = await this.clientImagesService.getImageById(imageId, clientId);
            res.status(200).json(image);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
//# sourceMappingURL=ClientImagesController.js.map