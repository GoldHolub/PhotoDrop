import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PhotographerRepository } from '../repositories/PhotographerRepository.js';
import dotenv from 'dotenv';
const photographerRepository = new PhotographerRepository();
dotenv.config();
export const register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await photographerRepository.findPhotographerByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        if (username.length < 4 || password.length < 4) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const user = await photographerRepository.create(username, password);
        res.status(201).json({ message: `${user.username} successfully registered` });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await photographerRepository.findPhotographerByUsername(username);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ username: user.username, role: "photographer" }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
export const refresh = async (req, res) => {
    return res.status(200).json(true);
};
//# sourceMappingURL=AuthController.js.map