// db.service.js
import firebaseService from '../services/firebaseService.js';
import localDB from '../services/localDB.service.js';

// Helper para intentar operación en Firebase y fallback a local
const withFallback = async (fnFirebase, fnLocal) => {
  try {
    return await fnFirebase();
  } catch (error) {
    console.warn('Fallback a local DB debido a:', error.message);
    return await fnLocal();
  }
};

// Obtener colección
const getCollection = async (collectionName) => {
  return withFallback(
    () => firebaseService.getCollection(collectionName),
    () => localDB.getCollection(collectionName)
  );
};

// Obtener documento por ID
const getDocument = async (collectionName, id) => {
  return withFallback(
    () => firebaseService.getDocument(collectionName, id),
    () => {
      const collection = localDB.getCollection(collectionName);
      return collection.find(item => item.id === id) || null;
    }
  );
};

// Agregar documento
const addDocument = async (collectionName, data, customId = null) => {
  return withFallback(
    () => firebaseService.addDocument(collectionName, data, customId),
    () => localDB.addDocument(collectionName, data) // localDB genera id numérico
  );
};

// Actualizar documento
const updateDocument = async (collectionName, id, data) => {
  return withFallback(
    () => firebaseService.updateDocument(collectionName, id, data),
    () => localDB.updateDocument(collectionName, id, data)
  );
};

// Eliminar documento
const deleteDocument = async (collectionName, id) => {
  return withFallback(
    () => firebaseService.deleteDocument(collectionName, id),
    () => localDB.deleteDocument(collectionName, id)
  );
};

export default { getCollection, getDocument, addDocument, updateDocument, deleteDocument };
