import { db } from "../drizzle/postgresDB.js";
import { eq } from 'drizzle-orm';
import { users, userSelfies } from "../drizzle/schema.js";
export class ClientRepository {
    async createClient(phoneNumber, chatId) {
        const [newClient] = await db
            .insert(users)
            .values({
            phoneNumber,
            telegramChatId: chatId
        })
            .returning();
        return newClient;
    }
    async findClientByPhone(phoneNumber) {
        const [client] = await db
            .select()
            .from(users)
            .where(eq(users.phoneNumber, phoneNumber));
        return client;
    }
    async getClientById(id) {
        const [client] = await db
            .select()
            .from(users)
            .where(eq(users.id, id));
        return client;
    }
    async updateClient(clientId, updatedData) {
        const [updatedClient] = await db
            .update(users)
            .set(updatedData)
            .where(eq(users.id, clientId))
            .returning();
        return updatedClient;
    }
    async updateClientSelfie(selfieId, selfie) {
        const [updatedSelfie] = await db
            .update(userSelfies)
            .set({ selfie })
            .where(eq(userSelfies.id, selfieId))
            .returning();
        return updatedSelfie;
    }
    async createClientSelfie(selfie) {
        const [newSelfie] = await db
            .insert(userSelfies)
            .values({ selfie })
            .returning({ id: userSelfies.id });
        return newSelfie;
    }
    async getClientSelfieById(selfieId) {
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
//# sourceMappingURL=ClientRepository.js.map