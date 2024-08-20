import { ClientService } from '../services/ClientService.js';
export class ClientController {
    clientService;
    constructor() {
        this.clientService = new ClientService();
    }
    async editClientName(req, res) {
        const clientName = req.body.clientName;
        // @ts-ignore
        const clientId = req.user?.id;
        try {
            const editedClient = await this.clientService.editClientName(clientId, clientName);
            res.status(201).json(editedClient);
        }
        catch (error) {
            res.status(500).json(error.message);
        }
    }
    async editClientEmail(req, res) {
        const clientEmail = req.body.clientEmail;
        // @ts-ignore
        const clientId = req.user?.id;
        try {
            const editedClient = await this.clientService.editClientEmail(clientId, clientEmail);
            res.status(201).json(editedClient);
        }
        catch (error) {
            res.status(500).json(error.message);
        }
    }
    async editClientSelfie(req, res) {
        try {
            // @ts-ignore
            const client = req.user;
            const files = req.files;
            const selfie = await this.clientService.editClientSelfie(files, client);
            return res.status(201).json(selfie);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async getClientInfo(req, res) {
        try {
            // @ts-ignore
            const client = req.user;
            const selfie = await this.clientService.getClientSelfie(client.selfieId);
            return res.status(200).json({ client, selfie });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
//# sourceMappingURL=ClientController.js.map