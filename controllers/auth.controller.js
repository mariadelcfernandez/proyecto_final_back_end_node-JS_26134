import {generateToken} from '../utils/token.generator.js';
import admin from 'firebase-admin';

const default_user = {
    id:'2F1NeHnksscsenyRHldhFQ3wEJF2',
    name:"User",
    email:"user1@email.com",
    password: "user11234",
    admin: true,
};

// Registro: espera email, password, name
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password son requeridos' });
    }

    // Crear usuario en Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      name: name || email.split('@')[0],
    });

    // Guardar perfil en Firestore (o local) con rol 'cliente'
    const userData = {
      uid: userRecord.uid,
      email: userRecord.email,
      name: userRecord.name || '',
      role: 'cliente',
      //createdAt: new Date().toISOString(),
    };
    await addDocument('users', userData, userRecord.uid); // usamos uid como id

    res.status(201).json({ message: 'Usuario creado', uid: userRecord.uid });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(400).json({ error: error.message });
  }
};


// Login: solo verificamos que el token sea válido (frontend envía token)
// El frontend hará login con Firebase Auth y enviará el token
const login = async (req, res) => {
  const token = generateToken(default_user);
res.json({ message: 'Token generado', token });
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Token requerido' });
    }
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;
    // Obtener rol del usuario desde Firestore/local
    const userData = await getDocument('users', uid);
    if (!userData) {
      return res.status(404).json({ error: 'Usuario no encontrado en base de datos' });
    }
    res.json({ 
      uid, 
      email: decodedToken.email,
      role: userData.role,
      name: userData.name || decodedToken.name || '',
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Obtener perfil del usuario autenticado
const getProfile = async (req, res) => {
  try {
    const uid = req.user.uid;
    const userData = await getDocument('users', uid);
    if (!userData) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(userData);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

export default { register, login, getProfile };

