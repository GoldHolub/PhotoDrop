import { Request, Response } from 'express';
import { ClientService } from '../services/ClientService.js';
import { UserType } from '../models/ProjectModels.js';

export class ClientController {
    private clientService: ClientService;
    constructor() {
        this.clientService = new ClientService();
    }
    async editClientName(req: Request, res: Response) {
        const clientName: string = req.body.clientName;
        // @ts-ignore
        const clientId: number = req.user?.id;
        try {
            const editedClient = await this.clientService.editClientName(clientId, clientName);
            res.status(201).json(editedClient);
        } catch (error: any) {
            res.status(500).json(error.message);
        }
    }

    async editClientEmail(req: Request, res: Response) {
        const clientEmail: string = req.body.clientEmail;
        // @ts-ignore
        const clientId: number = req.user?.id;
        try {
            const editedClient = await this.clientService.editClientEmail(clientId, clientEmail);
            res.status(201).json(editedClient);
        } catch (error: any) {
            res.status(500).json(error.message);
        }
    }

    async editClientSelfie(req: Request, res: Response) {
        try {
            // @ts-ignore
            const client: UserType = req.user;
            const files = req.files as Express.Multer.File[];
            const selfie = await this.clientService.editClientSelfie(files, client);
            return res.status(201).json(selfie);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getClientInfo(req: Request, res: Response) {
        try {
            // @ts-ignore
            const client: UserType = req.user;
            const selfie = await this.clientService.getClientSelfie(client.selfieId);
            return res.status(200).json({client, selfie});
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
    
}