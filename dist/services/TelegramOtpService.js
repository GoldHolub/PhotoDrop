import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import { ClientService } from './ClientService.js';
import { ClientRepository } from '../repositories/ClientRepository.js';
dotenv.config();
const bot = new TelegramBot('7361639608:AAG4Cu12p4E_oSEZY_sPxJ4TgT1toqaXwsA', { polling: true });
bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.chat.id;
    const options = {
        reply_markup: {
            keyboard: [
                [
                    {
                        text: "Share your phone number",
                        request_contact: true
                    }
                ]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    };
    bot.sendMessage(chatId, "Please share your phone number with me:", options);
});
bot.on('contact', async (msg) => {
    const chatId = msg.chat.id;
    const phoneNumber = msg.contact?.phone_number;
    if (!phoneNumber) {
        bot.sendMessage(chatId, `Can't get access to your phone number`);
    }
    else {
        await telegramOtpService.createAndAuthenticateClient(phoneNumber, chatId);
        bot.sendMessage(chatId, `Thanks for sharing your phone number: ${phoneNumber}`);
    }
});
export class TelegramOtpService {
    userOtpMap;
    constructor() {
        this.userOtpMap = new Map();
    }
    async sendOtp(phoneNumber) {
        try {
            const clientService = new ClientService();
            const client = await clientService.findClientByPhone(phoneNumber);
            if (!client || !client.telegramChatId) {
                return 'get OTP code: https://t.me/spicy_opt_verification_bot';
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            this.userOtpMap.set(phoneNumber, otp);
            const message = `Your verification code is ${otp}`;
            bot.sendMessage(client.telegramChatId, message);
            return 'OTP sent';
        }
        catch (error) {
            throw new Error(`Can't send message by this number: ${phoneNumber}`);
        }
    }
    verifyOtp(phoneNumber, otp) {
        const currentOTP = this.userOtpMap.get(phoneNumber);
        this.userOtpMap.delete(phoneNumber);
        return currentOTP === otp;
    }
    async createAndAuthenticateClient(phoneNumber, chatId) {
        try {
            const clientRepository = new ClientRepository();
            const existingClient = await clientRepository.findClientByPhone(phoneNumber);
            if (existingClient) {
                if (!existingClient.telegramChatId || existingClient.telegramChatId !== chatId) {
                    existingClient.telegramChatId = chatId;
                    await clientRepository.updateClient(existingClient.id, { telegramChatId: chatId });
                }
                return existingClient;
            }
            const newClient = await clientRepository.createClient(phoneNumber, chatId);
            return newClient;
        }
        catch (error) {
            throw error;
        }
    }
}
// Instantiate the service
const telegramOtpService = new TelegramOtpService();
export default telegramOtpService;
//# sourceMappingURL=TelegramOtpService.js.map