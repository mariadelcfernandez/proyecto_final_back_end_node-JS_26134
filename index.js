import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users.routes.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/products.routes.js';
import authMiddleware from './middlewares/auth.middleware.js';
import db from './services/firebaseService.js'; // Importamos la instancia de firebase';
dotenv.config();
//const express = require('express');
//const cors = require('cors');
const app = express();

//Middlewares globales
app.use(cors());
app.use(express.json());
app.use(authMiddleware); // Aplicar el middleware de autenticación a todas las rutas
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})
app.use((req, res, next) => {
    res.status(404).send({ error: 'Ruta no encontrada' });
});

//importamos rutas

//import categoriesRoutes from'./routes/categories.routes';
//import cartRoutes from './routes/cart.routes';
//import orderRoutes from './routes/order.routes';

//usamos las Rutas
app.use('/api/users', userRoutes);
//app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
//app.use('/api/categories', categoriesRoutes);
//app.use('/api/cart', cartRoutes);
//app.use('/api/orders', orderRoutes);

//Ruta de pruebas
app.get('/',async (req, res) => {
    const querySnapshot = await db.collection('users').get();
    console.log (querySnapshot.docs.map(doc => doc.data()));
    res.json({status: 'ok', message: 'BACKEND OK', data: 'Bienvenido a la API de E-commerce'});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});