import bcrypt from 'bcrypt';
import logger from '../logs/logger.js';
import 'dotenv/config';

export const encriptar = async(text) => {
    try {
        return await bcrypt.hash(text, Number.parseInt(process.env.BCRYPT_SALTROUNDS));
        await bcrypt.hash(text, +process.env.BCRYPT_SALTROUNDS).then((hash) => {
            return hash;
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error('Error al encriptar');
    }
}

export const comparar = async(text, hash) => {
    try {
        return await bcrypt.compare(text, hash);
        await bcrypt.compare(text, hash).then((result) => {
            return result;
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error('Error al comparar');
    }
}