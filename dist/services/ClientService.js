import { ClientRepository } from "../repositories/ClientRepository.js";
import fs from 'fs/promises';
export class ClientService {
    clientRepository;
    constructor() {
        this.clientRepository = new ClientRepository();
    }
    async createClient(phoneNumber, telegramChatId) {
        try {
            const client = await this.findClientByPhone(phoneNumber);
            if (client) {
                throw new Error(`Client by phone: ${client.phoneNumber} already exist`);
            }
            const newClient = await this.clientRepository.createClient(phoneNumber, telegramChatId);
            return newClient;
        }
        catch (error) {
            throw error;
        }
    }
    async findClientByPhone(phoneNumber) {
        if (!phoneNumber) {
            throw new Error('Please enter the phone number');
        }
        return await this.clientRepository.findClientByPhone(phoneNumber);
    }
    async checkClientCredentials(phoneNumber) {
        try {
            const client = await this.findClientByPhone(phoneNumber);
            return client && client.telegramChatId;
        }
        catch (error) {
            throw error;
        }
    }
    async editClientName(clientId, clientName) {
        if (!clientName || !clientId) {
            throw new Error('Please enter the clientName');
        }
        try {
            const updatedData = {
                name: clientName,
            };
            const updatedClient = await this.clientRepository.updateClient(clientId, updatedData);
            return updatedClient;
        }
        catch (error) {
            throw error;
        }
    }
    async editClientEmail(clientId, clientEmail) {
        if (!clientEmail || !clientId) {
            throw new Error('Please enter the clientEmail');
        }
        try {
            const updatedData = {
                email: clientEmail,
            };
            const updatedClient = await this.clientRepository.updateClient(clientId, updatedData);
            return updatedClient;
        }
        catch (error) {
            throw error;
        }
    }
    async editClientSelfie(files, client) {
        if (files.length > 1) {
            throw new Error('more than one file transferred');
        }
        try {
            const selfieBuffer = await fs.readFile(files[0].path);
            if (!client.selfieId) {
                const selfie = await this.clientRepository.createClientSelfie(selfieBuffer);
                client.selfieId = selfie.id;
                await this.clientRepository.updateClient(client.id, client);
                return selfie;
            }
            else {
                return await this.clientRepository.updateClientSelfie(client.selfieId, selfieBuffer);
            }
        }
        catch (error) {
            throw error;
        }
        finally {
            await fs.unlink(files[0].path);
        }
    }
    async getClientSelfie(selfieId) {
        try {
            if (!selfieId) {
                return null;
            }
            const selfie = await this.clientRepository.getClientSelfieById(selfieId);
            return selfie;
        }
        catch (error) {
            throw new Error(`Can't find selfie by id: ${selfieId}`);
        }
    }
}
//# sourceMappingURL=ClientService.js.map