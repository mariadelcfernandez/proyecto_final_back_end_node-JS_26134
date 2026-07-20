import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import admin  from '../services/firebaseService.js';
import verifyToken from '../utils/token.generator.js';


const authMiddleware = async (req, res, next) => {
  const autHeader = req.headers.authorization?.split('Bearer ')[1];
 // si no hay token, respondemos con un error 401
  if (!autHeader) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  try {
    // Verifica el token usando Firebase Admin SDK
    // Si el token es válido, decodifica el token y agrega la información 
    // del usuario al objeto req para que esté disponible en los siguientes middlewares o controladores.
    const token = authHeader.split(' ')[1]; // Extrae el token del encabezado de autorización,
    const decodedToken = await admin.auth().verifyIdToken(autHeader);
    req.user = decodedToken; // { uid, email, ... }
    next();
  } catch (error) {
    console.error('Error verificando token:', error);
    return res.status(401).json({ error: 'Invalido token' });
  }
  console.log(autHeader.split(' ')[1]);
  res.send('DEV');
};

export default authMiddleware;