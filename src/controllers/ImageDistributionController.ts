import { Request, Response } from 'express';
import { ClientRepository } from '../repositories/ClientRepository.js';
import { ImageRepository } from '../repositories/ImageRepository.js';
import { ImageDistributionService } from '../services/ImageDistributionService.js';

export class ImageDistributionController {
    private clientRepository: ClientRepository;
    private imageRepository: ImageRepository;

    constructor() {
        this.clientRepository = new ClientRepository();
        this.imageRepository = new ImageRepository();
    }

    async getUsers(req: Request, res: Response) {
        try {
            const clients = await this.clientRepository.getAllClients();
            res.status(200).json(clients);
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    }

    async getImages(req: Request, res: Response) {
        try {
            const images = await this.imageRepository.getAllImageInfo();
            res.status(200).json(images);
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    }

    async pairImagesWithUsers(req: Request, res: Response) {
        try {
            const pairs = req.body.data;
            const imageDistributionService = new ImageDistributionService();
            const currentPairs = await imageDistributionService.pairImagesToUser(pairs);
            res.status(200).json(currentPairs);
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    }

    async getImagesToUsersData(req: Request, res: Response) {
        try {
            const imagesToUsers = await this.imageRepository.getImageToUsersInfo();
            res.status(200).json(imagesToUsers);
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    }

}