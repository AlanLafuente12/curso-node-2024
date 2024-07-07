import logger from '../logs/logger.js';
import { User } from '../models/user.js';
import { comparar } from '../common/bcrypt.js';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { Status } from '../constants/index.js';

async function login(req, res) {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({
            where: { username, status: Status.ACTIVE }
        });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        if (!(await comparar(password, user.password))) {
            return res.status(404).json({ message: "Usuario no autorizado" });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: eval(process.env.JWT_EXPIRES_SECONDS)
        })
        return res.json({ token })

    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({
            message: error.message
        })
    }
}

export default { login };