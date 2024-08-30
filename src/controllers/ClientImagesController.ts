import { json } from 'body-parser';
import { Request, Response } from 'express';
import { ClientImagesService } from '../services/ClientImagesService.js';

export class ClientImagesController {
    private clientImagesService: ClientImagesService;

    constructor() {
        this.clientImagesService = new ClientImagesService();
    }
    async getAllImages(req: Request, res: Response) {
        // @ts-ignore
        const clientId: number = req.user?.id;
        try {
            const images = await this.clientImagesService.getAllImagesAndBuyFirst(clientId);
            res.status(200).json(images);
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    }

    async getImageById(req: Request, res: Response) {
        try {
            // @ts-ignore
            const clientId: number = req.user?.id;
            const imageId: number = parseInt(req.params.imageId); 
            const image = await this.clientImagesService.getImageById(imageId, clientId);
            res.status(200).json(image);
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    }
}