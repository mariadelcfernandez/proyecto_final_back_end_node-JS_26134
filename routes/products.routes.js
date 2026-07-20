import express from 'express';
import productController from'../controllers/products.controller.js';
import authMiddleware from'../middlewares/auth.middleware.js';
import  checkRole  from'../middlewares/role.middleware.js';
const router = express.Router();
// Rutas públicas
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Crear producto: solo vendedor o admin
router.post('/', authMiddleware, productController.createProduct);

// Editar: solo admin
router.put('/:id', authMiddleware, productController.updateProduct);

// Eliminar: solo admin
router.delete('/:id', authMiddleware, productController.deleteProduct);

export default router;