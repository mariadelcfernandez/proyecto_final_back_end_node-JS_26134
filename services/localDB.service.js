import fs from 'fs';
import path from 'path';
import  {fileURLToPath}  from 'url';
//const API_URL = `${import.meta.env.VITE_API_URL}/products`;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../../db.json');

const readDB = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer db.json:', error);
    return { users: [], products: [], carts: [], orders: [] };
  }
};

const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

const getCollection = (collectionName) => {
  const db = readDB();
  return db[collectionName] || [];
};

const setCollection = (collectionName, data) => {
  const db = readDB();
  db[collectionName] = data;
  writeDB(db);
};
/*

const addDocument = (collectionName, doc) => {
  const collection = getCollection(collectionName);
  const newId = collection.length > 0 ? Math.max(...collection.map(item => item.id)) + 1 : 1;
  const newDoc = { id: newId, ...doc };
  collection.push(newDoc);
  setCollection(collectionName, collection);
  return newDoc;
};*/

const updateDocument = (collectionName, id, updates) => {
  const collection = getCollection(collectionName);
  const index = collection.findIndex(item => item.id === id);
  if (index === -1) return null;
  collection[index] = { ...collection[index], ...updates };
  setCollection(collectionName, collection);
  return collection[index];
};

const deleteDocument = (collectionName, id) => {
  let collection = getCollection(collectionName);
  const initialLength = collection.length;
  collection = collection.filter(item => item.id !== id);
  if (collection.length === initialLength) return false;
  setCollection(collectionName, collection);
  return true;
};

export default {
  
  readDB,
  writeDB,
  //addDocument,
  getCollection,
  setCollection,
  updateDocument,
  deleteDocument,
};