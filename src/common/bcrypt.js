import bcrypt from 'bcrypt';
import logger from '../logs/logger.js';
import 'dotenv/config';

export const encriptar = async(text) => {
    try {
        // codigo que funciona
        return await bcrypt.hash(text, Number.parseInt(process.env.BCRYPT_SALTROUNDS));
        // codigo que esta en npm pero no funciona
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
        // codigo que funciona
        return await bcrypt.compare(text, hash);
        // codigo que esta en npm pero no funciona
        await bcrypt.compare(text, hash).then((result) => {
            return result;
        });
    } catch (error) {
        logger.error(error.message);
        throw new Error('Error al comparar');
    }
}