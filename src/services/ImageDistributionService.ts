import { bot } from "./TelegramOtpService.js";
import { ImageRepository } from "../repositories/ImageRepository.js";
import { ClientRepository } from "../repositories/ClientRepository.js";

export class ImageDistributionService {

    private imageRepository: ImageRepository;
    private clientRepository: ClientRepository;

    constructor() {
        this.imageRepository = new ImageRepository();
        this.clientRepository = new ClientRepository();
    }

    async pairImagesToUser(pairs: Array<{ id: number; photoIds: number[] }>) {
        try {
            const insertValues: Array<{ imageInfoId: number; userId: number }> = [];
            const userNotifications: Array<{ userId: number; telegramChatId: number }> = [];

            for (const pair of pairs) {
                const userId = pair.id;
                const photoIds = pair.photoIds;

                for (const imageInfoId of photoIds) {
                    insertValues.push({
                        imageInfoId,
                        userId
                    });
                }

                const client = await this.clientRepository.getClientById(userId);
                const telegramChatId = client.telegramChatId;
                if (telegramChatId) {
                    userNotifications.push({
                        userId,
                        telegramChatId,
                    });
                }
            }

            await this.imageRepository.insertImageUserPairs(insertValues);

            for (const notification of userNotifications) {
                await bot.sendMessage(notification.telegramChatId, 
                    'Your photos have been uploaded. Please visit the site: https://photodropapp.vercel.app/account');
            }

            return { message: 'Images paired successfully and notifications sent' };
        } catch (error: any) {
            throw new Error(`Error pairing images to users: ${error.message}`);
        }
    }
}