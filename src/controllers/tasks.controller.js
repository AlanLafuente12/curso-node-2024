import logger from "../logs/logger.js";
import { Task } from "../models/task.js";

async function getTasks(req, res) {
    const { userId } = req.user;
    try {
        const task = await Task.findAll({
            attributes: ['id', 'name', 'done', 'user_id'],
            order: [
                ['id', 'ASC']
            ],
            where: {
                user_id: userId
            }
        });
        return res.json(task);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({
            message: error.message
        })
    }
}
async function getTask(req, res) {
    const { id } = req.params;
    const { userId } = req.user;
    try {
        const task = await Task.findOne({
            attributes: ['id', 'name', 'done', 'user_id'],
            order: [
                ['id', 'ASC']
            ],
            where: {
                id: id,
                user_id: userId
            }
        });
        if (task) {
            return res.json(task);
        }
        return res.json({ message: `[task.controller] Task not found` });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({
            message: error.message
        })
    }
}
async function createTask(req, res) {
    const { name } = req.body;
    const { userId } = req.user;
    try {
        logger.info(`[task.controller] Creating task...`);
        const task = await Task.create({
            name: name,
            user_id: userId
        });
        logger.info(`[task.controller] Task '${task.name}' created!`);
        return res.json(task);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({
            message: error.message
        })
    }
}
async function updateTask(req, res) {
    const { id } = req.params;
    const { userId } = req.user;
    const { name } = req.body;
    try {
        logger.info(`[task.controller] Updating task...`);
        const updatedRecords = await Task.update({
            name: name
        }, {
            where: {
                id: id,
                user_id: userId
            }
        });
        logger.info(`[task.controller] Task name updated to '${name}' updated!`);
        if (updatedRecords[0] === 0) {
            return res.json({ message: `[task.controller] Task not found` });
        }
        return res.json({ message: `[task.controller] Task name updated to '${name}'` });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({
            message: error.message
        })
    }
}
async function taskDone(req, res) {
    const { id } = req.params;
    const { userId } = req.user;
    const { done } = req.body;
    try {
        logger.info(`[task.controller] Updating task's 'done' value ...`);
        const updatedRecords = await Task.update({
            done: done
        }, {
            where: {
                id: id,
                user_id: userId
            }
        });
        logger.info(`[task.controller] Task's 'done' value updated to'${done}'`);
        if (updatedRecords[0] === 0) {
            return res.json({ message: `[task.controller] Task not found` });
        }
        return res.json({ message: `[task.controller] Task's 'done' value updated to'${done}'` });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({
            message: error.message
        })
    }
}

async function deleteTask(req, res) {
    const { id } = req.params;
    try {
        logger.info(`[task.controller] Deleting task...`);
        const deletedRecords = await Task.destroy({
            where: {
                id: id
            }
        });
        logger.info(`[task.controller] Deleted records: ${deletedRecords}`);
        return res.json({ message: `[task.controller] Deleted records: ${deletedRecords}` });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({
            message: error.message
        })
    }
}

export default { getTasks, getTask, createTask, updateTask, deleteTask, taskDone };