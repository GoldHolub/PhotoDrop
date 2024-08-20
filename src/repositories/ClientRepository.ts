import { db } from "../drizzle/postgresDB.js";
import { eq } from 'drizzle-orm';
import { users, userSelfies } from "../drizzle/schema.js";
import { UserType } from "../models/ProjectModels.js";

export class ClientRepository {
    async createClient(phoneNumber: string, chatId: number) {
        const [newClient] = await db
            .insert(users)
            .values({
                phoneNumber,
                telegramChatId: chatId
            })
            .returning();

        return newClient;
    }

    async findClientByPhone(phoneNumber: string) {
        const [client] = await db
            .select()
            .from(users)
            .where(eq(users.phoneNumber, phoneNumber));

        return client;
    }

    async getClientById(id: number) {
        const [client] = await db
            .select()
            .from(users)
            .where(eq(users.id, id));

        return client
    }
    async updateClient(clientId: number, updatedData: Partial<UserType>) {
        const [updatedClient] = await db
            .update(users)
            .set(updatedData)
            .where(eq(users.id, clientId))
            .returning();

        return updatedClient;
    }

    async updateClientSelfie(selfieId: number, selfie: Buffer) {
        const [updatedSelfie] = await db
            .update(userSelfies)
            .set({ selfie })
            .where(eq(userSelfies.id, selfieId))
            .returning();

        return updatedSelfie;
    }

    async createClientSelfie(selfie: Buffer) {
        const [newSelfie] = await db
            .insert(userSelfies)
            .values({ selfie })
            .returning({ id: userSelfies.id });

        return newSelfie;

    }
    async getClientSelfieById(selfieId: number) {
        const [selfie] = await db
            .select()
            .from(userSelfies)
            .where(eq(userSelfies.id, selfieId));

        return selfie;
    }

    async getAllClients() {
        const clients = await db
            .select({ id: users.id, phone: users.phoneNumber, name: users.name, email: users.email, selfieId: users.selfieId })
            .from(users);

        return clients;
    }
}