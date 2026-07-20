import express  from 'express';
import authController from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import checkRole  from '../middlewares/role.middleware.js';
const router = express.Router();
// Ruta pública de registro
router.post('/register', authController.register);

// Ruta pública de login (envía token)
router.post('/login', authController.login);

// Ruta protegida para obtener perfil
router.get('/profile', authMiddleware, authController.getProfile);

export default router;