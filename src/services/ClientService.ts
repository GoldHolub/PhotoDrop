import { ClientRepository } from "../repositories/ClientRepository.js"
import { users } from "../drizzle/schema.js";
import { UserType } from "../models/ProjectModels.js";
import fs from 'fs/promises';

export class ClientService {
    private clientRepository: ClientRepository;

    constructor() {
        this.clientRepository = new ClientRepository();
    }

    async createClient(phoneNumber: string, telegramChatId: number) {
        try {
            const client = await this.findClientByPhone(phoneNumber);

            if (client) {
                throw new Error(`Client by phone: ${client.phoneNumber} already exist`);
            }
            const newClient = await this.clientRepository.createClient(phoneNumber, telegramChatId);
            return newClient;
        } catch (error) {
            throw error;
        }
    }

    async findClientByPhone(phoneNumber: string) {
        if (!phoneNumber) {
            throw new Error('Please enter the phone number');
        }

        return await this.clientRepository.findClientByPhone(phoneNumber);
    }

    async checkClientCredentials(phoneNumber: string) {
        try {
            const client = await this.findClientByPhone(phoneNumber);
            return client && client.telegramChatId;
        } catch (error) {
            throw error;
        }
    }

    async editClientName(clientId: number, clientName: string) {
        if (!clientName || !clientId ) {
            throw new Error('Please enter the clientName');
        }
        try {
            const updatedData: Partial<UserType>  = {
                name: clientName,
            }

            const updatedClient = await this.clientRepository.updateClient(clientId, updatedData);
            return updatedClient;
        } catch (error) {
            throw error;
        }
    }
    
    async editClientEmail(clientId: number, clientEmail: string) {
        if (!clientEmail || !clientId ) {
            throw new Error('Please enter the clientEmail');
        }
        try {
            const updatedData: Partial<UserType>  = {
                email: clientEmail,
            }

            const updatedClient = await this.clientRepository.updateClient(clientId, updatedData);
            return updatedClient;
        } catch (error) {
            throw error;
        }
    }
    
    async editClientSelfie(files: Express.Multer.File[], client: UserType) {
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
            } else {
                return await this.clientRepository.updateClientSelfie(client.selfieId, selfieBuffer);
            }
        } catch (error) {
            throw error;
        }  finally {
            await fs.unlink(files[0].path);
        }
    }

    async getClientSelfie(selfieId: number | null) {
        try {
            if (!selfieId) {
                return null;
            }
            const selfie = await this.clientRepository.getClientSelfieById(selfieId);
            return selfie;
        } catch (error) {
            throw new Error(`Can't find selfie by id: ${selfieId}`);
        }

    }
}