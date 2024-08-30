import { ClientRepository } from '../repositories/ClientRepository.js';
import { ImageRepository } from '../repositories/ImageRepository.js';
import { ImageDistributionService } from '../services/ImageDistributionService.js';
export class ImageDistributionController {
    clientRepository;
    imageRepository;
    constructor() {
        this.clientRepository = new ClientRepository();
        this.imageRepository = new ImageRepository();
    }
    async getUsers(req, res) {
        try {
            const clients = await this.clientRepository.getAllClients();
            res.status(200).json(clients);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async getImages(req, res) {
        try {
            const images = await this.imageRepository.getAllImageInfo();
            res.status(200).json(images);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async pairImagesWithUsers(req, res) {
        try {
            const pairs = req.body.data;
            const imageDistributionService = new ImageDistributionService();
            const currentPairs = await imageDistributionService.pairImagesToUser(pairs);
            res.status(200).json(currentPairs);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async getImagesToUsersData(req, res) {
        try {
            const imagesToUsers = await this.imageRepository.getImageToUsersInfo();
            res.status(200).json(imagesToUsers);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
//# sourceMappingURL=ImageDistributionController.js.map