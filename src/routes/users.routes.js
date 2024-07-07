import { Router } from 'express';
import usersController from '../controllers/users.controller.js';
import { authenticateToken } from '../middlewares/authenticate.middleware.js'
const router = Router();

router.route('/')
    .get(usersController.getUsers)
    .post(usersController.createUser);
router.route('/:id')
    .get(authenticateToken, usersController.getUser)
    .put(authenticateToken, usersController.updateUser)
    .delete(authenticateToken, usersController.deleteUser)
    .patch(authenticateToken, usersController.activeInactive);
router.route('/:id/tasks')
    .get(authenticateToken, usersController.getTasks);
export default router;

// router.get('/', usersController.getUsers);