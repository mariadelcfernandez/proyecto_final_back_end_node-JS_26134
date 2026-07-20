import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import path from 'path'; // Importa el módulo 'path' para trabajar con rutas.env';
import { fileURLToPath  } from 'url';
import dotenv from 'dotenv';
dotenv.config();
const GOOGLE_APPLICATION_CREDENTIALS = path.join( './src/firebase-service-account.json');

initializeApp({
  credential: cert(GOOGLE_APPLICATION_CREDENTIALS),
 // databaseURL: process.env.DATABASE_URL
});

const db = getFirestore();

export default { db };