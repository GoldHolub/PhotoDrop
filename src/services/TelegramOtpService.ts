import TelegramBot from 'node-telegram-bot-api';
import { ClientService } from './ClientService.js';
import { ClientRepository } from '../repositories/ClientRepository.js';

export const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true });

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
    } else {
        const checkedPhoneNumber = telegramOtpService.checkNumberAndFix(phoneNumber);
        await telegramOtpService.createAndAuthenticateClient(checkedPhoneNumber, chatId);
        bot.sendMessage(chatId, `Thanks for sharing your phone number: ${phoneNumber}`);
    }
});

export class TelegramOtpService {
    private userOtpMap: Map<string, string>;

    constructor() {
        this.userOtpMap = new Map();
    }

    public async sendOtp(phoneNumber: string): Promise<string> {
        let checkedPhoneNumber;
        try {
            checkedPhoneNumber = telegramOtpService.checkNumberAndFix(phoneNumber);
            const clientService = new ClientService();
            const client = await clientService.findClientByPhone(checkedPhoneNumber);
            if (!client || !client.telegramChatId) {
                return 'get OTP code: https://t.me/spicy_opt_verification_bot';
            }

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            this.userOtpMap.set(checkedPhoneNumber, otp);
            const message = `Your verification code is ${otp}`;
            bot.sendMessage(client.telegramChatId, message);
            return 'OTP sent';
        } catch (error) {
            throw new Error(`Can't send message by this number: ${checkedPhoneNumber}`);
        }
    }

    public verifyOtp(phoneNumber: string, otp: string): boolean {
        const checkedPhoneNumber = telegramOtpService.checkNumberAndFix(phoneNumber);
        const currentOTP = this.userOtpMap.get(checkedPhoneNumber);
        this.userOtpMap.delete(checkedPhoneNumber);
        return currentOTP === otp;
    }

    public checkNumberAndFix(phoneNumber: string): string {
        phoneNumber = phoneNumber.trim();
    
        if (!phoneNumber.startsWith('+')) {
            return `+${phoneNumber}`;
        }
        return phoneNumber;
    }

    async createAndAuthenticateClient(phoneNumber: string, chatId: number) {
        try {
            const clientRepository = new ClientRepository();
            const checkedPhoneNumber = telegramOtpService.checkNumberAndFix(phoneNumber);
            const existingClient = await clientRepository.findClientByPhone(checkedPhoneNumber);
            if (existingClient) {
                if (!existingClient.telegramChatId || existingClient.telegramChatId !== chatId) {
                    existingClient.telegramChatId = chatId;
                    await clientRepository.updateClient(existingClient.id,{ telegramChatId: chatId});
                }
                return existingClient;
            }

            const newClient = await clientRepository.createClient(checkedPhoneNumber, chatId);
            return newClient;
        } catch (error) {
            throw error;
        }
    }
}

const telegramOtpService = new TelegramOtpService();
export default telegramOtpService;