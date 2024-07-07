import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { Status } from '../constants/index.js';
import { Task } from './task.js';
import { encriptar } from '../common/bcrypt.js'
import logger from '../logs/logger.js';

export const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: 'Ingrese nombre de usuario'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Ingrese password'
            }
        }
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: Status.ACTIVE,
        validate: {
            isIn: {
                args: [
                    [Status.ACTIVE, Status.INACTIVE]
                ],
                msg: `Debe ser ${Status.ACTIVE} o ${Status.INACTIVE}`
            }
        }
    }
});

/*
// simplificado (solo si es en ingles y cada id lleva el nombre 'id')
User.hasMany(Task)
Task.belongsTo(User)
*/

User.hasMany(Task, {
    foreignKey: 'user_id',
    sourceKey: 'id'
})
Task.belongsTo(User, {
    foreignKey: 'user_id',
    sourceKey: 'id'
})

User.beforeCreate(async(user) => {
    try {
        user.password = await encriptar(user.password);
    } catch (error) {
        logger.error(error.message);
        throw new Error('Error al encriptar el password');
    }
});

User.beforeUpdate(async(user) => {
    try {
        user.password = await encriptar(user.password);
    } catch (error) {
        logger.error(error.message);
        throw new Error('Error al encriptar el password');
    }
});