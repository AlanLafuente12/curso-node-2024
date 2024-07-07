import { User } from '../models/user.js';
import { Task } from '../models/task.js'
import logger from '../logs/logger.js';
import { Status } from '../constants/index.js';
import { encriptar } from '../common/bcrypt.js';

async function getUsers(req, res) {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'password', 'status'],
            order: [
                ['id', 'DESC']
            ],
            where: {
                status: Status.ACTIVE
            }
        });
        return res.json(users);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({
            message: error.message
        })
    }
}
async function getUser(req, res) {
    const { id } = req.params;
    try {
        const user = await User.findOne({
            attributes: ['username', 'status'],
            order: [
                ['id', 'DESC']
            ],
            where: {
                id: id,
                status: Status.ACTIVE
            }
        });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        return res.json(user);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({
            message: error.message
        })
    }
}
async function createUser(req, res) {
    const { username, password } = req.body;
    try {
        logger.info(`[user.controller] Creating user...`);
        const user = await User.create({
            username: username,
            password: password
        });
        logger.info(`[user.controller] User '${user.username}' created!`);
        return res.json(user);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({
            message: error.message
        })
    }
}
async function updateUser(req, res) {
    let password = req.body.password
    const { username, status } = req.body;
    const { id } = req.params;
    try {
        if (!username || !password || !status) {
            return res.status(400).json({
                message: 'Faltan datos en la consulta'
            })
        }
        logger.info(`[user.controller] Updating user...`);
        password = await encriptar(password);
        const updatedRecords = await User.update({
            username: username,
            password: password,
            status: status
        }, {
            where: {
                id: id
            }
        });
        logger.info(`[user.controller] User '${username}' updated!`);
        return res.json(updatedRecords);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({
            message: error.message
        })
    }
}
async function deleteUser(req, res) {
    const { id } = req.params;
    try {
        logger.info(`[user.controller] Deleting user...`);
        const deletedTasks = await Task.destroy({
            where: {
                user_id: id
            }
        });
        const deletedUsers = await User.destroy({
            where: {
                id: id
            }
        });
        logger.info(`[user.controller] Deleted users: ${deletedUsers}, Deleted tasks: ${deletedTasks}`);
        return res.sendStatus(204);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({
            message: error.message
        })
    }
}

const activeInactive = async(req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    try {
        if (!status) {
            return res.status(400).json({
                message: `Falta el parametro 'status'`
            })
        }
        const user = await User.findByPk(id);
        if (user.status === status) {
            return res.status(409)
                .json({ message: `El usuario ya se encuentra en estado '${status}'` })
        }
        user.status = status;
        await user.save();
        logger.info(`[user.controller] User status updated`);
        return res.json(user);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({
            message: error.message
        })
    }
}

async function getTasks(req, res) {
    const { id } = req.params;
    try {
        const user = await User.findOne({
            attributes: ['username'],
            order: [
                ['id', 'DESC']
            ],
            where: {
                id: id
            },
            include: {
                model: Task,
                attributes: ['name', 'done'],
                /*where: {
                    done: 'true'
                }*/
            }
        });
        return res.json(user);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({
            message: error.message
        })
    }
}

export default { getUsers, getUser, createUser, updateUser, deleteUser, activeInactive, getTasks };