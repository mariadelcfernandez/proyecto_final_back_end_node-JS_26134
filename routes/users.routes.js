import express from 'express';
const router = express.Router();
import userController from'../controllers/users.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import  checkRole  from '../middlewares/role.middleware.js';

// Todas las rutas de usuarios requieren autenticación y rol admin  checkRole(['admin'])
router.get('/', authMiddleware,  userController.getUsers);
router.put('/:id/role', authMiddleware, userController.updateUserRole);

export default router;