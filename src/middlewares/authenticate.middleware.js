import jwt from 'jsonwebtoken';
import 'dotenv/config';

export function authenticateToken(req, res, next) {
    // obtener el token en la cabecera de autorizacion
    const authHeader = req.headers.authorization;
    // limpiar la cadena
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(401);
        }
        req.user = user;
        next();
    })
}