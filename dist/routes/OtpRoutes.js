import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import telegramOtpService from '../services/TelegramOtpService.js';
dotenv.config();
const router = express.Router();
router.post('/api/otp/send-otp', async (req, res) => {
    const { phoneNumber } = req.body;
    try {
        const answer = await telegramOtpService.sendOtp(phoneNumber);
        res.json({ message: answer });
    }
    catch (error) {
        res.status(400).json({ message: `OTP can't be sent by this phone: ${phoneNumber}` });
    }
});
router.post('/api/otp/verify-otp', async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;
        if (!phoneNumber || !otp) {
            res.json({ message: 'provide username and/or otp code' });
        }
        if (telegramOtpService.verifyOtp(phoneNumber, otp)) {
            const token = jwt.sign({ phoneNumber: phoneNumber, role: "client" }, 'your_jwt_secret', { expiresIn: '2h' });
            res.json({ token, message: 'your phone is verified' });
        }
        else {
            res.status(400).json({ error: 'Invalid OTP or Phone(username)' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export default router;
//# sourceMappingURL=OtpRoutes.js.map